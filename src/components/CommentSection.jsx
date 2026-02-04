import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { getAvatarById, DEFAULT_AVATAR_ID, AVATARS } from "../lib/avatars";
import { formatDate } from "../lib/format";
import { apiFetch } from "../lib/api";

/**
 * CommentSection Component
 * Displays existing comments and allows users to add new comments
 * Includes avatar selection for comment authors
 */
export default function CommentSection({ postId, comments = [], onCommentAdded }) {
  const { theme } = useTheme();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR_ID);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Handle comment submission
   * Validates input and sends comment to API
   */
  async function handleSubmitComment(e) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!commentText.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    if (commentText.length > 500) {
      setError("Comment is too long (max 500 characters)");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        postId,
        name: name.trim(),
        comment: commentText.trim(),
        avatar
      };

      const response = await apiFetch("/api/comments", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      // Reset form on success
      setCommentText("");
      setName("");
      setAvatar(DEFAULT_AVATAR_ID);
      setShowCommentForm(false);

      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded(response.comment);
      }
    } catch (err) {
      setError(err.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        borderTop: `1px solid ${theme.border}`,
        paddingTop: 12
      }}
    >
      {/* Comments header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: theme.textPrimary
          }}
        >
          Comments ({comments.length})
        </h4>

        {!showCommentForm && (
          <button
            type="button"
            onClick={() => setShowCommentForm(true)}
            style={{
              padding: "6px 12px",
              borderRadius: 16,
              border: `1px solid ${theme.primary}`,
              background: "transparent",
              color: theme.primary,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.primaryBg;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
          >
            Add Comment
          </button>
        )}
      </div>

      {/* Comment form */}
      {showCommentForm && (
        <form
          onSubmit={handleSubmitComment}
          style={{
            marginBottom: 16,
            padding: 12,
            background: theme.surfaceHover,
            borderRadius: 8,
            border: `1px solid ${theme.borderLight}`
          }}
        >
          {/* Name input */}
          <div style={{ marginBottom: 8 }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={40}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid ${theme.borderLight}`,
                background: theme.surface,
                color: theme.textPrimary,
                fontSize: 14
              }}
            />
          </div>

          {/* Avatar selection - compact version */}
          <div style={{ marginBottom: 8 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                marginBottom: 4,
                color: theme.textSecondary
              }}
            >
              Choose Avatar
            </label>
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap"
              }}
            >
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatar(av.id)}
                  style={{
                    width: 32,
                    height: 32,
                    padding: 4,
                    borderRadius: 6,
                    border: avatar === av.id
                      ? `2px solid ${theme.primary}`
                      : `1px solid ${theme.borderLight}`,
                    background: avatar === av.id
                      ? theme.primaryBg
                      : theme.surface,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  title={av.name}
                >
                  <img
                    src={av.icon}
                    alt={av.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      opacity: avatar === av.id ? 1 : 0.6
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment textarea */}
          <div style={{ marginBottom: 8 }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              rows={3}
              maxLength={500}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid ${theme.borderLight}`,
                background: theme.surface,
                color: theme.textPrimary,
                fontSize: 14,
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
            <div
              style={{
                fontSize: 11,
                color: theme.textSecondary,
                textAlign: "right",
                marginTop: 2
              }}
            >
              {commentText.length}/500
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                color: theme.danger,
                fontSize: 12,
                marginBottom: 8,
                padding: 6,
                background: theme.dangerBg,
                borderRadius: 4
              }}
            >
              {error}
            </div>
          )}

          {/* Form buttons */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => {
                setShowCommentForm(false);
                setError("");
                setCommentText("");
                setName("");
                setAvatar(DEFAULT_AVATAR_ID);
              }}
              disabled={loading}
              style={{
                padding: "6px 12px",
                borderRadius: 16,
                border: `1px solid ${theme.borderLight}`,
                background: theme.surface,
                color: theme.textPrimary,
                fontSize: 12,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "6px 16px",
                borderRadius: 16,
                border: "none",
                background: loading ? theme.borderLight : theme.primary,
                color: "white",
                fontSize: 12,
                fontWeight: 500,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}

      {/* Comments list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {comments.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 24,
              color: theme.textSecondary,
              fontSize: 14
            }}
          >
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => {
            const commentAvatar = getAvatarById(comment.avatar || DEFAULT_AVATAR_ID);
            return (
              <div
                key={comment._id}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: 10,
                  background: theme.surfaceHover,
                  borderRadius: 8,
                  border: `1px solid ${theme.borderLight}`
                }}
              >
                {/* Comment avatar */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: `1px solid ${theme.borderLight}`
                  }}
                >
                  <img
                    src={commentAvatar.icon}
                    alt={commentAvatar.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>

                {/* Comment content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: theme.textPrimary
                      }}
                    >
                      {comment.name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: theme.textSecondary
                      }}
                    >
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.4,
                      color: theme.textPrimary,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}
                  >
                    {comment.comment}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
