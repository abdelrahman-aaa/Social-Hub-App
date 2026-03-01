// Third-party Library Imports
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";

// Local Component Imports
import PostCard from "../../Components/PostCard/PostCard";
import CreatePost from "../../Components/CreatePost/CreatePost";
import { ScrollShadow } from "@heroui/react";

/**
 * Posts Page Component
 *
 * Main feed page that displays a list of all posts and a form to create new ones.
 * Uses TanStack React Query for efficient data fetching and caching.
 */
export default function Posts() {
  /**
   * Fetches the complete list of posts from the server.
   * Requires user authentication token in the request headers.
   *
   * @returns {Promise<Object>} Axios response containing the list of posts
   */
  function getAllPosts() {
    return axios.get(`${import.meta.env.VITE_BASE_URL}/posts`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }

  // Set up React Query for fetching posts
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPosts,
    // Extract only the post array from the nested API response
    select: function (data) {
      return data.data.data.posts;
    },
  });

  // Display a skeleton loading state while fetching posts
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-5 mt-4">
        {Array.from({ length: 50 }).map(function (_, i) {
          return <Skeleton key={i} count={5} height={400} />;
        })}
      </div>
    );
  }

  // Display an error message if the API request failed
  if (isError) {
    return (
      <p className="text-center text-red-400 mt-10">
        {error?.response?.data?.error ||
          "Failed to load posts. Please try again."}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 mt-4">
      <title>Social Hub App</title>
      {/* Component for users to formulate and submit a new post */}
      <CreatePost />

      {/* Map over the fetched array of posts and render a PostCard for each */}
      {data?.map(function (post) {
        return <PostCard key={post._id} post={post} />;
      })}
    </div>
  );
}
