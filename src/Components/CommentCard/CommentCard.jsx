// UI Components
import { Avatar, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

// Context for comparing the current logged-in user against the comment author
import { useContext, useState } from "react";
import { AuthUserContext } from "../../Context/AuthContextProvider/AuthContextProvider";

// Owner action components
import DeleteComment from "../DeleteComment/DeleteComment";
import UpdateComment from "../UpdateComment/UpdateComment";

/**
 * CommentCard Component
 *
 * Renders a single comment. Shows ✏️ edit and 🗑 delete buttons only for
 * the comment's author. Inline edit is handled by UpdateComment — when the
 * user saves, `displayContent` updates immediately (optimistic-like UX)
 * while the query refetch happens in the background.
 *
 * @param {Object} props
 * @param {Object} props.comment - Comment object. Expected shape:
 *   {
 *     _id, content, createdAt, post,
 *     commentCreator: { _id, name, photo }   ← nested (preferred)
 *     -- OR flat: name, photo               ← fallback
 *   }
 */
export default function CommentCard({ comment }) {
  if (!comment) return null;

  const { userData } = useContext(AuthUserContext);

  // ── Field normalisation ─────────────────────────────────────────────────
  const _id = comment._id;
  const createdAt = comment.createdAt;
  const postId = comment.post;

  const creator = comment.commentCreator || {};
  const name = creator.name || comment.name;
  const photo = creator.photo || comment.photo;
  const authorId = creator._id || creator.id;

  // ── Optimistic display content ──────────────────────────────────────────
  // Starts as the server value; UpdateComment calls onSave to update it
  // immediately after a successful mutation — before the refetch completes.
  const [displayContent, setDisplayContent] = useState(comment.content);

  // ── Ownership check ─────────────────────────────────────────────────────
  const currentUserId = userData?._id || userData?.id;
  const isOwner = currentUserId && authorId && currentUserId === authorId;

  return (
    <>
      <Card className="bg-black/85 m-6 text-white">
        {/* Header: Author Info + Owner Actions */}
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar isBordered radius="full" size="md" src={photo} />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none">{name}</h4>
              <h5 className="text-small tracking-tight">
                {new Date(createdAt).toLocaleString("en-CA")}
              </h5>
            </div>
          </div>

          {/* ✏️ Edit + 🗑 Delete — only visible to the comment's author */}
          {isOwner && (
            <div className="flex items-center gap-1">
              <UpdateComment
                commentId={_id}
                postId={postId}
                content={displayContent}
                onSave={setDisplayContent}
              />
              <DeleteComment commentId={_id} postId={postId} />
            </div>
          )}
        </CardHeader>

        {/* Body: Comment Text (or inline edit form) */}
        <CardBody className="px-3 py-0 text-small">{displayContent}</CardBody>
        <CardFooter className="gap-3"></CardFooter>
      </Card>
    </>
  );
}
