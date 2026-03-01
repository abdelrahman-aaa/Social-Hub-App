// UI Components from HeroUI
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
} from "@heroui/react";

// Icons and Routing
import { MessageText } from "iconsax-reactjs";
import { Link } from "react-router";

// Local Sub-components
import CommentCard from "../CommentCard/CommentCard";
import CreateComments from "../CreateComments/CreateComments";
import DeletePost from "../DeletePost/DeletePost";
import UpdatePost from "../UpdatePost/UpdatePost";
import LikePost from "../LikePost/LikePost";

// Context
import { useContext } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";

/**
 * PostCard Component
 *
 * Displays a single post including its author details, content, and an optional attached image.
 * Conditional logic dictates whether to show all comments, a top comment, or a comment creation box
 * depending on whether detailed comment data is passed down.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.post - The primary post data payload
 * @param {Array|null} props.comments - An array of full comments if fetched, otherwise null/undefined
 */
export default function PostCard({ post, comments }) {
  const { userData } = useContext(AuthUserContext);

  // Destructure relevant fields from the nested post object
  const { createdAt, body, image, user, commentsCount, topComment, _id } = post;

  const { name, photo } = user;

  // Normalize IDs: API may return either `_id` or `id`
  const currentUserId = userData?._id || userData?.id;
  const postAuthorId = user?._id || user?.id;
  const isOwner =
    currentUserId && postAuthorId && currentUserId === postAuthorId;

  return (
    <>
      <Card className="">
        {/* Header: User Info and Post Timestamp */}
        <CardHeader className="flex justify-between items-start">
          <div className="flex gap-3">
            <Image
              alt="User avatar"
              height={40}
              radius="sm"
              src={photo}
              width={40}
            />
            <div className="flex flex-col">
              <p className="text-md capitalize font-semibold">{name}</p>
              <p className="text-small text-default-500">
                {new Date(createdAt).toLocaleString("en-CA")}
              </p>
            </div>
          </div>

          {/* Conditionally render edit + delete buttons only if current user is the author */}
          {isOwner && (
            <div className="flex items-center gap-1">
              <UpdatePost id={_id} body={body} />
              <DeletePost id={_id} />
            </div>
          )}
        </CardHeader>
        <Divider />

        {/* Body: Text and Image Content */}
        <CardBody>
          <p className="text-center font-semibold mb-2.5">{body}</p>
          {/* Render image only if it exists in the payload */}
          {image && (
            <img
              src={image}
              alt={`Post by ${name}`}
              className="object-cover rounded-lg"
            />
          )}
        </CardBody>
        <Divider />

        {/* Footer: Like button, comment count, and All Comments link */}
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-4">
            {/* Like toggle — optimistic update built in */}
            <LikePost postId={_id} />
          </div>

          {/* Show a link to the detailed post view if comments aren't being fully passed down in the current view */}
          {!comments && (
            <Link
              to={`/PostDetails/${_id}`}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <p>{commentsCount}</p>
                <MessageText size="22" className="text-gray-400" />
              </div>
            </Link>
          )}
        </CardFooter>

        {/* Conditional Rendering: Show brief top comment snippet when detailed list isn't requested */}
        {comments && commentsCount > 0 && <CommentCard comment={topComment} />}

        {/* Conditional Rendering: Show full array of detailed comments if requested */}
        {comments &&
          comments.map((e) => <CommentCard key={e._id} comment={e} />)}

        {/* Reply Section */}
        <div className="m-6">
          <CreateComments id={_id} />
        </div>
      </Card>
    </>
  );
}
