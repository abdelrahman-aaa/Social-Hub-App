import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { Edit2 } from "iconsax-reactjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * UpdatePost Component
 *
 * Renders a pencil icon button. Clicking it opens a modal with the post's
 * current body pre-filled in a textarea. On submit, sends PUT /posts/:id.
 * On success, invalidates the allPosts query so the feed refreshes.
 *
 * @param {Object} props
 * @param {string} props.id   - The post's _id
 * @param {string} props.body - The post's current body text (pre-fills the form)
 */
export default function UpdatePost({ id, body }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();

  // ── Form ──────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { body }, // pre-fill with the existing post content
  });

  // ── Mutation ──────────────────────────────────────────────────────────────
  const mutation = useMutation({
    /**
     * PUT /posts/:id
     * Body: { body }
     * Header: token
     */
    mutationFn: async ({ body }) => {
      return axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${id}`,
        { body },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
    },

    onSuccess: () => {
      // Refresh the feed so the updated body is immediately visible
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      // Also refresh post detail view if it's open
      queryClient.invalidateQueries({ queryKey: ["postDetails", id] });
      toast.success("Post updated successfully");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to update post",
      );
    },
  });

  // ── Submit Handler ────────────────────────────────────────────────────────
  const handleUpdate = (data, onClose) => {
    mutation.mutate(
      { body: data.body.trim() },
      {
        onSuccess: () => {
          onClose();
          reset({ body: data.body.trim() }); // update default so re-opening shows latest text
        },
      },
    );
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Trigger: pencil icon button shown in the post header */}
      <Button
        isIconOnly
        color="primary"
        variant="light"
        aria-label="Edit Post"
        onPress={onOpen}
      >
        <Edit2 size="20" />
      </Button>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={handleSubmit((data) => handleUpdate(data, onClose))}
            >
              <ModalHeader className="flex flex-col gap-1">
                Edit Post
              </ModalHeader>

              <ModalBody>
                <Textarea
                  label="Post content"
                  minRows={4}
                  isInvalid={!!errors.body}
                  errorMessage={errors.body?.message}
                  {...register("body", {
                    required: "Post content cannot be empty",
                    validate: (v) =>
                      v.trim().length > 0 || "Post content cannot be empty",
                    minLength: {
                      value: 3,
                      message: "Post must be at least 3 characters",
                    },
                  })}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={mutation.isPending}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
