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
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Public Wall</h3>
        <button type="button" onClick={loadFirst} disabled={loading}>
          Refresh
        </button>
      </div>

      {err ? <div style={{ color: "crimson" }}>{err}</div> : null}
      {loading ? <div>Loading…</div> : null}

      {items.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}

      {!done ? (
        <button type="button" onClick={loadMore} disabled={!cursor}>
          Load more
        </button>
      ) : (
        <div style={{ opacity: 0.7, fontSize: 13 }}>You’re all caught up.</div>
      )}
    </div>
  );
}