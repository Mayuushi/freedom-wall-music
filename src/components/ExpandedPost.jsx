import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { getAvatarById, DEFAULT_AVATAR_ID } from "../lib/avatars";
import { formatDate } from "../lib/format";
import { apiFetch } from "../lib/api";
import CommentSection from "./CommentSection";

/**
 * ExpandedPost Component
 * Modal view showing full post details with reactions and comments
 * Allows users to react and comment on posts
 */
export default function ExpandedPost({ post, onClose, onUpdate }) {
  const { theme } = useTheme();
  const [localPost, setLocalPost] = useState(post);
  const [reacting, setReacting] = useState(false);

  // Get avatar for the post author
  const avatarData = getAvatarById(localPost.avatar || DEFAULT_AVATAR_ID);

  // Calculate reaction count and check if user has reacted
  const reactionCount = localPost.reactions?.length || 0;
  
  /**
   * Handle reaction toggle (add or remove)
   * Uses localStorage to track if user has reacted (simple implementation)
   */
  async function handleReaction() {
    if (reacting) return;

    setReacting(true);
    try {
      const response = await apiFetch("/api/reactions", {
        method: "POST",
        body: JSON.stringify({
          postId: localPost._id,
          reactionType: "heart"
        })
      });

      // Update local state with new reaction count
      const updatedPost = {
        ...localPost,
        reactions: response.action === "added"
          ? [...(localPost.reactions || []), { type: "heart" }]
          : (localPost.reactions || []).slice(0, -1)
      };

      setLocalPost(updatedPost);

      // Notify parent to update the main feed
      if (onUpdate) {
        onUpdate(updatedPost);
      }
    } catch (err) {
      console.error("Failed to react:", err);
    } finally {
      setReacting(false);
    }
  }

  /**
   * Handle new comment added
   * Updates local post state with the new comment
   */
  function handleCommentAdded(newComment) {
    const updatedPost = {
      ...localPost,
      comments: [...(localPost.comments || []), newComment]
    };
    setLocalPost(updatedPost);

    // Notify parent to update the main feed
    if (onUpdate) {
      onUpdate(updatedPost);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.modalBackdrop,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        overflow: "auto"
      }}
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: theme.surface,
          borderRadius: 12,
          maxWidth: 800,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: theme.isDarkMode
            ? "0 8px 32px rgba(0, 0, 0, 0.6)"
            : "0 8px 32px rgba(0, 0, 0, 0.3)"
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${theme.border}`,
            position: "sticky",
            top: 0,
            background: theme.surface,
            zIndex: 1
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: theme.textPrimary
            }}
          >
            Post Details
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: theme.textSecondary,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => (e.target.style.background = theme.surfaceHover)}
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Post content */}
        <div style={{ padding: 20 }}>
          {/* YouTube embed - full width */}
          {localPost.youtube?.videoId && (
            <div
              style={{
                width: "100%",
                aspectRatio: "16/9",
                background: "#000",
                borderRadius: 8,
                overflow: "hidden",
                marginBottom: 16
              }}
            >
              <iframe
                title="YouTube embed"
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${localPost.youtube.videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0, display: "block" }}
              />
            </div>
          )}

          {/* Author info */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginBottom: 16
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: theme.surfaceHover,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
                border: `2px solid ${theme.borderLight}`
              }}
            >
              <img
                src={avatarData.icon}
                alt={avatarData.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>

            {/* Author name and metadata */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: theme.textPrimary,
                  marginBottom: 4
                }}
              >
                {localPost.name || "Anonymous"}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: theme.textSecondary,
                  marginBottom: 4
                }}
              >
                {formatDate(localPost.createdAt)}
              </div>
              {localPost.recipient && (
                <div
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    background: theme.surfaceHover,
                    borderRadius: 12,
                    color: theme.textSecondary,
                    fontWeight: 500,
                    display: "inline-block"
                  }}
                >
                  To: {localPost.recipient}
                </div>
              )}
            </div>
          </div>

          {/* YouTube title */}
          {localPost.youtube?.title && (
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: theme.textPrimary,
                marginBottom: 12
              }}
            >
              🎵 {localPost.youtube.title}
            </div>
          )}

          {/* Message */}
          <p
            style={{
              whiteSpace: "pre-wrap",
              margin: "0 0 16px 0",
              fontSize: 15,
              lineHeight: 1.6,
              color: theme.textPrimary,
              wordBreak: "break-word"
            }}
          >
            {localPost.message}
          </p>

          {/* Reaction button */}
          <div
            style={{
              display: "flex",
              gap: 16,
              paddingTop: 12,
              borderTop: `1px solid ${theme.border}`,
              marginBottom: 16
            }}
          >
            <button
              type="button"
              onClick={handleReaction}
              disabled={reacting}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: `1px solid ${theme.borderLight}`,
                background: theme.surface,
                color: theme.textPrimary,
                fontSize: 14,
                fontWeight: 500,
                cursor: reacting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                if (!reacting) {
                  e.target.style.background = theme.surfaceHover;
                  e.target.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!reacting) {
                  e.target.style.background = theme.surface;
                  e.target.style.transform = "scale(1)";
                }
              }}
            >
              <span style={{ fontSize: 18 }}>❤️</span>
              <span>{reactionCount}</span>
            </button>
          </div>

          {/* Comments section */}
          <CommentSection
            postId={localPost._id}
            comments={localPost.comments || []}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      </div>
    </div>
  );
}
