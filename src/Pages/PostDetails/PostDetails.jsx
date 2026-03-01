// React and Routing Imports
import { useParams } from "react-router";

// Third-party Library Imports
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";

// Local Component Imports
import PostCard from "../../Components/PostCard/PostCard";

/**
 * PostDetails Page Component
 *
 * Displays the full details of a single post along with its associated comments.
 * Uses URL parameters to determine which post to fetch.
 */
export default function PostDetails() {
  // Extract the specific post ID (named 'details' in the route) from the URL
  const { details } = useParams();

  /**
   * Fetches the specific post details by its ID.
   *
   * @returns {Promise<Object>} Axios response containing the post details
   */
  function getSinglePostDetails() {
    return axios.get(`${import.meta.env.VITE_BASE_URL}/posts/${details}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }

  /**
   * Fetches comments associated with the specific post.
   * Currently retrieves the first page with a limit of 10 comments.
   *
   * @returns {Promise<Object>} Axios response containing the list of comments
   */
  function getPostComment() {
    return axios.get(
      `${import.meta.env.VITE_BASE_URL}/posts/${details}/comments?page=1&limit=10`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
  }

  // React Query hook to manage comment fetching and caching
  const { data: commentData, isLoading: commentLoading } = useQuery({
    queryKey: ["postComment", details],
    queryFn: getPostComment,
    select: function (commentData) {
      return commentData.data.data.comments;
    },
  });

  // React Query hook to manage the primary post data fetching and caching
  const { data, isLoading } = useQuery({
    queryKey: ["postDetails", details],
    queryFn: getSinglePostDetails,
    select: function (data) {
      // Safely navigate the nested API response to locate post details
      if (data.data && data.data.data && data.data.data.post) {
        return data.data.data.post;
      }
      return data.data.post || data.data;
    },
  });

  // Display skeleton loaders while either post data or comments are being fetched
  if (isLoading || commentLoading) {
    return <Skeleton count={5} height={400} />;
  }

  return (
    <>
      <div className="max-w-3xl mx-auto mt-4">
        {/* Double check loading state within layout container */}
        {isLoading ? (
          <Skeleton count={5} height={400} />
        ) : data ? (
          // Submits the individual post and its comments directly into the versatile PostCard component
          <PostCard comments={commentData} post={data} />
        ) : (
          // Fallback state if the requested post was not found on the server
          <p className="text-center font-semibold text-gray-400 mt-10">
            Post not found
          </p>
        )}
      </div>
    </>
  );
}
