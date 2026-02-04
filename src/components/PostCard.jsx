import { useState } from "react";
import { formatDate } from "../lib/format";
import { useTheme } from "../contexts/ThemeContext";
import { getAvatarById, DEFAULT_AVATAR_ID } from "../lib/avatars";
import { apiFetch } from "../lib/api";

export default function PostCard({ post, onExpand, onUpdate }) {
  const { theme } = useTheme();
  const [reacting, setReacting] = useState(false);
  
  // Get the avatar for this post, fallback to default if not found
  const avatarData = getAvatarById(post.avatar || DEFAULT_AVATAR_ID);
  
  // Calculate counts for reactions and comments
  const reactionCount = post.reactions?.length || 0;
  const commentCount = post.comments?.length || 0;

  /**
   * Handle quick reaction (without opening the post)
   * Prevents event bubbling to avoid triggering post expansion
   * Uses optimistic update for seamless UX
   */
  async function handleQuickReaction(e) {
    e.stopPropagation(); // Prevent post expansion
    if (reacting) return;

    setReacting(true);
    
    // Optimistic update - update UI immediately
    const optimisticPost = {
      ...post,
      reactions: [...(post.reactions || []), { type: "heart" }]
    };
    if (onUpdate) {
      onUpdate(optimisticPost);
    }

    try {
      const response = await apiFetch("/api/reactions", {
        method: "POST",
        body: JSON.stringify({
          postId: post._id,
          reactionType: "heart"
        })
      });

      // Update with actual server response
      if (onUpdate) {
        const updatedPost = {
          ...post,
          reactions: response.action === "added"
            ? [...(post.reactions || []), { type: "heart" }]
            : (post.reactions || []).slice(0, -1)
        };
        onUpdate(updatedPost);
      }
    } catch (err) {
      console.error("Failed to react:", err);
      // Rollback on error
      if (onUpdate) {
        onUpdate(post);
      }
    } finally {
      setReacting(false);
    }
  }
  
  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        overflow: "hidden",
        background: theme.surface,
        transition: "box-shadow 0.2s ease, transform 0.1s ease",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      onClick={() => onExpand && onExpand(post)}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.isDarkMode 
          ? "0 2px 8px rgba(255,255,255,0.1)"
          : "0 2px 8px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* YouTube embed section - shown first if available */}
      {post.youtube?.videoId ? (
        <div style={{ width: "100%", aspectRatio: "16/9", background: "#000" }}>
          <iframe
            title="YouTube embed"
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${post.youtube.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 0, display: "block" }}
          />
        </div>
      ) : null}

      {/* Card content */}
      <div style={{ padding: 12, flex: 1 }}>
        {/* Header with author info and timestamp */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            marginBottom: 8
          }}
        >
          {/* Avatar - display selected avatar image */}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: theme.surfaceHover,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
              border: `2px solid ${theme.borderLight}`
            }}
            title={avatarData?.name || "Avatar"}
          >
            {avatarData?.icon ? (
              <img 
                src={avatarData.icon} 
                alt={avatarData.name} 
                style={{ 
                  width: "100%", 
                  height: "100%",
                  objectFit: "cover"
                }} 
              />
            ) : (
              // Fallback if avatar image fails to load
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: post.anonymous
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                {post.anonymous ? "?" : (post.name?.[0]?.toUpperCase() || "A")}
              </div>
            )}
          </div>

          {/* Author name and date */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: theme.textPrimary,
                marginBottom: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {post.name || "Anonymous"}
            </div>
            <div style={{ opacity: 0.6, fontSize: 12, color: theme.textSecondary }}>
              {formatDate(post.createdAt)}
            </div>
          </div>

          {/* Recipient badge - top right */}
          {post.recipient ? (
            <div
              style={{
                fontSize: 11,
                padding: "4px 8px",
                background: theme.surfaceHover,
                borderRadius: 12,
                color: theme.textSecondary,
                fontWeight: 500,
                flexShrink: 0
              }}
            >
              To: {post.recipient}
            </div>
          ) : null}
        </div>

        {/* YouTube title if attached */}
        {post.youtube?.title ? (
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: theme.textPrimary,
              marginBottom: 8,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "36px"
            }}
          >
            🎵 {post.youtube.title}
          </div>
        ) : null}

        {/* Message content - emphasized */}
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: theme.isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
            borderRadius: 8,
            borderLeft: `3px solid ${theme.primary}`,
            minHeight: "50px"
          }}
        >
          <p
            style={{
              whiteSpace: "pre-wrap",
              margin: 0,
              fontSize: 15,
              lineHeight: 1.6,
              color: theme.textPrimary,
              fontWeight: 500,
              wordBreak: "break-word",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical"
            }}
          >
            {post.message.length > 100 ? `${post.message.slice(0, 100)}...` : post.message}
          </p>
        </div>

        {/* Interaction buttons - reactions and comments */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
            paddingTop: 12,
            borderTop: `1px solid ${theme.border}`
          }}
        >
          {/* Quick reaction button */}
          <button
            type="button"
            onClick={handleQuickReaction}
            disabled={reacting}
            style={{
              padding: "6px 12px",
              borderRadius: 16,
              border: `1px solid ${theme.borderLight}`,
              background: theme.surface,
              color: theme.textPrimary,
              fontSize: 13,
              fontWeight: 500,
              cursor: reacting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
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
            <span style={{ fontSize: 16 }}>❤️</span>
            <span>{reactionCount}</span>
          </button>

          {/* Comment button - opens expanded view */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand && onExpand(post);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: 16,
              border: `1px solid ${theme.borderLight}`,
              background: theme.surface,
              color: theme.textPrimary,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.surfaceHover;
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = theme.surface;
              e.target.style.transform = "scale(1)";
            }}
          >
            <span style={{ fontSize: 16 }}>💬</span>
            <span>{commentCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}