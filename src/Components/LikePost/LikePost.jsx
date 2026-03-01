import { Button } from "@heroui/react";
import { Heart } from "iconsax-reactjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * LikePost Component
 *
 * Fetches the likes for a post from GET /posts/:postId/likes (same pattern as
 * how comments are fetched with GET /posts/:id/comments).
 *
 * Optimistic update strategy (no separate local state needed — we mutate
 * the React Query cache directly):
 *  1. onMutate  → cancel in-flight refetches, snapshot cache, flip it instantly
 *  2. onError   → restore the snapshot (rollback)
 *  3. onSettled → refetch from server to confirm authoritative state
 *
 * @param {Object} props
 * @param {string} props.postId - The post's _id
 */
export default function LikePost({ postId }) {
  const queryClient = useQueryClient();
  const { userData } = useContext(AuthUserContext);
  const currentUserId = userData?._id || userData?.id;

  // ── Query Key ────────────────────────────────────────────────────────────
  // Same shape convention as ["postComment", postId]
  const likesQueryKey = ["postLikes", postId];

  // ── Fetch Likes ───────────────────────────────────────────────────────────
  // GET /posts/:postId/likes  →  returns array of user objects who liked
  const { data: likes = [] } = useQuery({
    queryKey: likesQueryKey,
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/posts/${postId}/likes`, {
          headers: { token: localStorage.getItem("token") },
        })
        .then((res) => {
          // API may return { data: { likes: [...] } } or { data: [...] }
          const payload = res.data?.data;
          return Array.isArray(payload)
            ? payload
            : (payload?.likes ?? res.data?.likes ?? []);
        }),
    // Keep stale data visible while re-fetching for a smooth UX
    staleTime: 30_000,
  });

  // Derive liked state and count from the fetched array
  // Each element may be an object { _id } or a plain string ID
  const likedUserIds = likes.map((like) =>
    typeof like === "string" ? like : like?._id || like?.id,
  );
  const isLiked = likedUserIds.includes(currentUserId);
  const likeCount = likes.length;

  // ── Mutation with Cache-Level Optimistic Update ───────────────────────────
  const mutation = useMutation({
    // PUT /posts/:id/like  (as confirmed by the user's change)
    mutationFn: () =>
      axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}/like`,
        {},
        { headers: { token: localStorage.getItem("token") } },
      ),

    // 1. OPTIMISTIC — directly mutate the cached likes array
    onMutate: async () => {
      // Stop any outgoing refetch from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: likesQueryKey });

      // Snapshot current cache for rollback
      const previousLikes = queryClient.getQueryData(likesQueryKey);

      // Flip the cache instantly
      queryClient.setQueryData(likesQueryKey, (old = []) => {
        const ids = old.map((l) =>
          typeof l === "string" ? l : l?._id || l?.id,
        );
        if (ids.includes(currentUserId)) {
          // Unlike — remove entry
          return old.filter((l) => {
            const id = typeof l === "string" ? l : l?._id || l?.id;
            return id !== currentUserId;
          });
        } else {
          // Like — add a minimal entry so count + isLiked update instantly
          return [...old, { _id: currentUserId }];
        }
      });

      return { previousLikes };
    },

    // 2. ROLLBACK — restore snapshot on failure
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(likesQueryKey, context?.previousLikes);
      toast.error("Failed to update like. Please try again.");
    },

    // 3. SYNC — refetch from server so UI matches authoritative state
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: likesQueryKey });
    },
  });

  // ── Handler ───────────────────────────────────────────────────────────────
  const handleLike = () => {
    if (!currentUserId) {
      toast.error("You must be logged in to like posts");
      return;
    }
    mutation.mutate();
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex items-center gap-1">
      <Button
        isIconOnly
        variant="light"
        size="sm"
        aria-label={isLiked ? "Unlike post" : "Like post"}
        onPress={handleLike}
        isDisabled={mutation.isPending}
        className={isLiked ? "text-red-500" : "text-default-400"}
      >
        <Heart size="22" variant={isLiked ? "Bold" : "Linear"} />
      </Button>

      {/* Like count from fetched data */}
      <span className="text-small text-default-500 min-w-[1ch]">
        {likeCount}
      </span>
    </div>
  );
}
