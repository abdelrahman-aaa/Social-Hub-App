import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Trash } from "iconsax-reactjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * DeleteComment Component
 *
 * Renders a small trash icon button. When clicked, a confirmation modal
 * appears before the DELETE /comments/:id request is sent to the API.
 * On success, only the comments query for the relevant post is invalidated.
 *
 * @param {Object} props
 * @param {string} props.commentId - The ID of the comment to delete
 * @param {string} props.postId    - The ID of the post that owns this comment
 *                                   (used as the query-key scope for precise invalidation)
 */
export default function DeleteComment({ commentId, postId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();

  // ─── Mutation ────────────────────────────────────────────────────────────
  const mutation = useMutation({
    /**
     * Sends a DELETE request to the API.
     * Token is read from localStorage, consistent with all other requests
     * in this project.
     */
    mutationFn: async () => {
      return axios.delete(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
    },


    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postComment", postId] });
      toast.success("Comment deleted successfully");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to delete comment",
      );
    },
  });

  // ─── Handler ──────────────────────────────────────────────────────────────
  const handleDelete = (onClose) => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Trigger: small icon-only button shown next to the comment */}
      <Button
        isIconOnly
        color="danger"
        variant="light"
        size="sm"
        aria-label="Delete Comment"
        onPress={onOpen}
      >
        <Trash size="18" />
      </Button>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Comment
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this comment? This action
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  isLoading={mutation.isPending}
                  onPress={() => handleDelete(onClose)}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
