import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../lib/api";
import PostCard from "./PostCard";

// Infinite-ish feed with cursor pagination.
// Performance best practice:
// - request smaller pages
// - only load more when needed
// - keep payload small via backend projection

export default function Feed({ refreshKey }) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  // Avoid duplicate loads
  const loadingRef = useRef(false);

  async function loadFirst() {
    setErr("");
    setLoading(true);
    setDone(false);
    setCursor(null);

    try {
      const data = await apiFetch("/api/posts?limit=20");
      setItems(data.items || []);
      setCursor(data.nextCursor || null);
      setDone(!data.nextCursor);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (loadingRef.current || done || !cursor) return;
    loadingRef.current = true;
    setErr("");

    try {
      const data = await apiFetch(`/api/posts?limit=20&cursor=${encodeURIComponent(cursor)}`);
      setItems((prev) => [...prev, ...(data.items || [])]);
      setCursor(data.nextCursor || null);
      setDone(!data.nextCursor);
    } catch (e) {
      setErr(e.message);
    } finally {
      loadingRef.current = false;
    }
  }

  useEffect(() => {
    loadFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <div>
      {/* Feed header with refresh button */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 24
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#0f0f0f" }}>
          Public Wall
        </h3>
        <button
          type="button"
          onClick={loadFirst}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: 18,
            border: "1px solid #ddd",
            background: "white",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 500,
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.background = "#f8f8f8";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.background = "white";
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error display */}
      {err ? (
        <div
          style={{
            color: "#d93025",
            background: "#fce8e6",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14
          }}
        >
          {err}
        </div>
      ) : null}

      {/* Grid container for posts - YouTube style responsive grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
          marginBottom: 24
        }}
      >
        {items.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </div>

      {/* Empty state when no posts and not loading */}
      {!loading && items.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 48,
            color: "#606060",
            fontSize: 14
          }}
        >
          No posts yet. Be the first to share!
        </div>
      )}

      {/* Load more button or end indicator */}
      {items.length > 0 && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          {!done ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={!cursor}
              style={{
                padding: "10px 24px",
                borderRadius: 20,
                border: "1px solid #ddd",
                background: "white",
                cursor: cursor ? "pointer" : "not-allowed",
                fontSize: 14,
                fontWeight: 500,
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => {
                if (cursor) e.target.style.background = "#f8f8f8";
              }}
              onMouseLeave={(e) => {
                if (cursor) e.target.style.background = "white";
              }}
            >
              Load more
            </button>
          ) : (
            <div style={{ opacity: 0.6, fontSize: 13 }}>
              You're all caught up.
            </div>
          )}
        </div>
      )}
    </div>
  );
}