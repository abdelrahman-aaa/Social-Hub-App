// UI and Icon Components
import { Button, Form, Image, Input } from "@heroui/react";
import { DocumentUpload } from "iconsax-reactjs";

// React Hooks and Contexts
import { useContext } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";

// Form Handling, Querying, and API Imports
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * CreateComments Component
 *
 * Provides an inline form for users to write and submit comments on a specific post.
 * Utilizes React Query's `useMutation` to handle requests and invalidate cache upon success.
 *
 * @param {Object} props - Component properties
 * @param {string} props.id - The unique identifier of the post being commented on
 */
export default function CreateComments({ id }) {
  // Access global user context for the author's avatar and name
  const { userData } = useContext(AuthUserContext);

  // Initialize React Hook Form logic
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
    },
  });

  // Access the query client to imperatively invalidate caches when mutations succeed
  const queryClient = useQueryClient();

  /**
   * Constructs the payload and triggers a POST request to save the comment.
   *
   * @param {Object} data - Contains the text input (`content`)
   */
  function sendComment(data) {
    const myFormData = new FormData();
    myFormData.append("content", data.content);

    toast.promise(
      axios.post(
        `${import.meta.env.VITE_BASE_URL}/posts/${id}/comments`,
        myFormData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      ),
      {
        loading: "Creating Comment...",
        success: function ({ data }) {
          // Clear form and refetch posts so the new comment appears without a hard refresh
          reset();
          queryClient.invalidateQueries({ queryKey: ["allPosts"] });
          return data.message;
        },
        error: function ({
          response: {
            data: { error },
          },
        }) {
          return error || "Failed to create comment";
        },
      },
    );
  }

  // Set up React Query mutation block to track the pending state automatically
  const { mutate, isPending } = useMutation({
    mutationFn: sendComment,
  });

  return (
    <>
      <Form
        onSubmit={handleSubmit(mutate)}
        className="bg-gray-500/60 p-6 rounded-2xl"
      >
        <div className="flex w-full items-center gap-3">
          <Image
            alt="User avatar"
            height={40}
            radius="sm"
            src={userData?.photo}
            width={40}
          />
          <Input
            type="text"
            {...register("content")}
            placeholder={`Type your comment, ${userData?.name}`}
          />
        </div>

        {/* The submit button displays a loading spinner when `isPending` is true */}
        <Button
          color="primary"
          className="w-full mt-5"
          type="submit"
          variant="shadow"
          isLoading={isPending}
        >
          Comment
        </Button>
      </Form>
    </>
  );
}
