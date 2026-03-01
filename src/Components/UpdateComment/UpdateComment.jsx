import { Button, Textarea } from "@heroui/react";
import { Edit2, CloseCircle, TickCircle } from "iconsax-reactjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * UpdateComment Component — Inline Edit Mode
 *
 * Renders a pencil icon button. When clicked, the comment's text is replaced
 * in-place by a small textarea with Save ✓ and Cancel ✗ icon buttons.
 * No modal — the edit happens directly inside the CommentCard body.
 *
 * @param {Object} props
 * @param {string} props.commentId - The comment's _id
 * @param {string} props.postId    - Parent post's _id (query invalidation scope)
 * @param {string} props.content   - Current comment text (pre-fills the textarea)
 * @param {Function} props.onSave  - Called with the new text after a successful save,
 *                                   so CommentCard can reflect the update instantly
 *                                   without waiting for a refetch (optimistic-like UX).
 */
export default function UpdateComment({ commentId, postId, content, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // ── Form ──────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { content } });

  // ── Mutation ──────────────────────────────────────────────────────────────
  const mutation = useMutation({
    /**
     * PUT /posts/:postId/comments/:commentId
     * Body: { content }
     * Header: token
     *
     * URL pattern mirrors the existing DeleteComment in this project.
     */
    mutationFn: async ({ content }) => {
      return axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
        { content },
        { headers: { token: localStorage.getItem("token") } },
      );
    },

    onSuccess: ({ data }, variables) => {
      // 1. Narrow invalidation — only this post's comments refetch
      queryClient.invalidateQueries({ queryKey: ["postComment", postId] });

      // 2. Optimistic-like UX — notify CommentCard immediately with the new text
      //    so the UI updates before the refetch completes
      onSave?.(variables.content.trim());

      toast.success("Comment updated");
      setIsEditing(false);
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to update comment",
      );
    },
  });

  // ── Cancel ────────────────────────────────────────────────────────────────
  const handleCancel = () => {
    reset({ content }); // restore original text
    setIsEditing(false);
  };

  // ── Idle Mode: just the pencil icon ───────────────────────────────────────
  if (!isEditing) {
    return (
      <Button
        isIconOnly
        color="primary"
        variant="light"
        size="sm"
        aria-label="Edit Comment"
        onPress={() => setIsEditing(true)}
      >
        <Edit2 size="18" />
      </Button>
    );
  }

  // ── Edit Mode: inline textarea + save/cancel ───────────────────────────────
  return (
    <form
      onSubmit={handleSubmit((data) =>
        mutation.mutate({ content: data.content }),
      )}
      className="w-full flex flex-col gap-2 mt-2"
    >
      <Textarea
        autoFocus
        minRows={2}
        isInvalid={!!errors.content}
        errorMessage={errors.content?.message}
        {...register("content", {
          required: "Comment cannot be empty",
          validate: (v) => v.trim().length > 0 || "Comment cannot be blank",
          minLength: {
            value: 1,
            message: "Comment is too short",
          },
        })}
      />

      <div className="flex gap-2 justify-end">
        {/* Cancel */}
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="default"
          aria-label="Cancel edit"
          onPress={handleCancel}
          isDisabled={mutation.isPending}
        >
          <CloseCircle size="20" />
        </Button>

        {/* Save */}
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="success"
          type="submit"
          aria-label="Save comment"
          isLoading={mutation.isPending}
        >
          {!mutation.isPending && <TickCircle size="20" />}
        </Button>
      </div>
    </form>
  );
}
