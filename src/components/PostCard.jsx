import { formatDate } from "../lib/format";
import { useTheme } from "../contexts/ThemeContext";
import { getAvatarById, DEFAULT_AVATAR_ID } from "../lib/avatars";

export default function PostCard({ post }) {
  const { theme } = useTheme();
  
  // Get the avatar for this post, fallback to default if not found
  const avatarData = getAvatarById(post.avatar || DEFAULT_AVATAR_ID);
  
  return (
    <div
      style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        overflow: "hidden",
        background: theme.surface,
        transition: "box-shadow 0.2s ease, transform 0.1s ease",
        cursor: "default",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.isDarkMode 
          ? "0 2px 8px rgba(255,255,255,0.1)"
          : "0 2px 8px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
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
              overflow: "hidden"
            }}
          >
            🎵 {post.youtube.title}
          </div>
        ) : null}

        {/* Message content */}
        <p
          style={{
            whiteSpace: "pre-wrap",
            margin: 0,
            fontSize: 14,
            lineHeight: 1.5,
            color: theme.textPrimary,
            wordBreak: "break-word",
            display: "-webkit-box",
            WebkitLineClamp: post.youtube?.videoId ? 4 : 6,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {post.message}
        </p>
      </div>
    </div>
  );
}