import { formatDate } from "../lib/format";

export default function PostCard({ post }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 10,
        padding: 12,
        background: "white"
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
        <strong>{post.name || "Anonymous"}</strong>
        <span style={{ opacity: 0.6, fontSize: 12 }}>{formatDate(post.createdAt)}</span>
        {post.recipient ? (
          <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.8 }}>
            To: <strong>{post.recipient}</strong>
          </span>
        ) : null}
      </div>

      <p style={{ whiteSpace: "pre-wrap", marginTop: 10 }}>{post.message}</p>

      {post.youtube?.videoId ? (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 13, marginBottom: 6 }}>
            🎵 <strong>{post.youtube.title}</strong>
          </div>
          <iframe
            title="YouTube embed"
            width="100%"
            height="220"
            src={`https://www.youtube.com/embed/${post.youtube.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 0, borderRadius: 8 }}
          />
        </div>
      ) : null}
    </div>
  );
}