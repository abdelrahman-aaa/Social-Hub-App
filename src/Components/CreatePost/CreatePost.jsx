// UI Components from HeroUI
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Form,
  Image,
  Input,
} from "@heroui/react";

// Icons and React Hooks
import { DocumentUpload } from "iconsax-reactjs";
import { useContext, useRef, useState } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";

// Form Handling and Networking
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * CreatePost Component
 *
 * Provides an interface for authenticated users to create a new post.
 * Supports text content and an optional image attachment.
 */
export default function CreatePost() {
  // Global user context to access the current user's details (name, photo)
  const { userData } = useContext(AuthUserContext);

  // React Hook Form initialization
  const { handleSubmit, register, reset } = useForm({
    defaultValues: {
      body: "",
    },
  });

  // Local state for the selected image file and its display preview URL
  const [image, setImage] = useState(null);
  const [userImage, setUserImage] = useState(null);

  // Ref to trigger the hidden file input programmatically
  const imageUpload = useRef();

  /**
   * Handles the selection of a new image file.
   * Updates state with the actual File object and a local preview URL.
   *
   * @param {Event} e - The file input change event
   */
  function handleImageUpload(e) {
    setImage(e.target.files[0]);
    setUserImage(URL.createObjectURL(e.target.files[0]));
  }

  /**
   * Form submission handler for creating a new post.
   * Converts the input data and selected image into FormData for a multipart API request.
   *
   * @param {Object} data - Form data containing the post body
   */
  function sendPost(data) {
    const myFormData = new FormData();
    myFormData.append("body", data.body);

    // Append the image only if the user selected one
    if (image) {
      myFormData.append("image", image);
    }

    toast.promise(
      axios.post(`${import.meta.env.VITE_BASE_URL}/posts`, myFormData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      }),
      {
        loading: "Post Creating...",
        success: function ({ data }) {
          // Clear the form and image preview upon successful creation
          reset();
          setUserImage(null);
          setImage(null);
          return data.message;
        },
        error: function ({
          response: {
            data: { error },
          },
        }) {
          return error || "Failed to create post";
        },
      },
    );
  }

  return (
    <>
      <Card className="bg-gray-400/60">
        <CardHeader className="flex gap-3">
          <h2>Create Post {userData?.name}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col">
            <p className="text-md capitalize font-semibold"></p>
            <p className="text-small text-default-500"></p>
          </div>

          <Form onSubmit={handleSubmit(sendPost)}>
            <div className="flex w-full items-center gap-3">
              <Image
                alt="user avatar"
                height={40}
                radius="sm"
                src={userData.photo}
                width={40}
              />
              <Input
                type="text"
                {...register("body")}
                placeholder="What's On Your Mind?"
              />
              <DocumentUpload
                size="32"
                className="text-blue-500 cursor-pointer"
                onClick={function () {
                  // Open the file dialog when the upload icon is clicked
                  imageUpload.current.click();
                }}
              />
            </div>
            {/* Display image preview if an image was selected */}
            {userImage && (
              <img
                src={userImage}
                alt="Post preview"
                className="mt-3 rounded-lg max-h-60 object-cover"
              />
            )}

            <Button
              color="primary"
              className="w-full mt-5"
              type="submit"
              variant="shadow"
            >
              Post
            </Button>
          </Form>
          <p className="text-center font-semibold mb-2.5"></p>
        </CardBody>
        <Divider />
        <CardFooter className="flex justify-between "></CardFooter>

        {/* Hidden file input for image attachment */}
        <input
          type="file"
          className="hidden"
          onChange={handleImageUpload}
          ref={imageUpload}
        />
      </Card>
    </>
  );
}
