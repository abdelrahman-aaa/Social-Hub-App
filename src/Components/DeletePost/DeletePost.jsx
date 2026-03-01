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
 * DeletePost Component
 * Renders a trash icon button that opens a confirmation modal before deleting the post.
 *
 * @param {Object} props
 * @param {string} props.id - The ID of the post to delete
 */
export default function DeletePost({ id }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (postId) => {
      return axios.delete(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
    },
    onSuccess: () => {
      // Refresh the posts list after successful deletion
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to delete post",
      );
    },
  });
 

  const handleDelete = (onClose) => {
    mutation.mutate(id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      <Button
        isIconOnly
        color="danger"
        variant="light"
        aria-label="Delete Post"
        onPress={onOpen}
      >
        <Trash size="24" />
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Post
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this post? This action cannot
                  be undone.
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
