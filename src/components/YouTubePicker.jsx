import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";

// Lets user search YouTube and pick a video to attach.
// NOTE: results are served from our serverless function so API key stays hidden.

export default function YouTubePicker({ value, onChange }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Debounce input for performance (reduces API calls)
  const debouncedQuery = useDebouncedValue(query, 450);

  useEffect(() => {
    let ignore = false;

    async function run() {
      setErr("");
      const q = debouncedQuery.trim();
      if (q.length < 2) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const data = await apiFetch(`/api/youtube/search?q=${encodeURIComponent(q)}`);
        if (!ignore) setItems(data.items || []);
      } catch (e) {
        if (!ignore) setErr(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  const selected = value;

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong>Attach music (YouTube)</strong>
        {selected ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{ marginLeft: "auto" }}
          >
            Remove
          </button>
        ) : null}
      </div>

      {selected ? (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 14, marginBottom: 6 }}>
            Attached: <strong>{selected.title}</strong>
          </div>
          {/* Embed the attached video */}
          <iframe
            title="YouTube embed"
            width="100%"
            height="220"
            src={`https://www.youtube.com/embed/${selected.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 0, borderRadius: 8 }}
          />
        </div>
      ) : null}

      {!selected ? (
        <>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a song or artist..."
            style={{ width: "100%", marginTop: 10, padding: 10 }}
          />

          {loading ? <p style={{ marginTop: 8 }}>Searching…</p> : null}
          {err ? <p style={{ marginTop: 8, color: "crimson" }}>{err}</p> : null}

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {items.map((it) => (
              <button
                key={it.videoId}
                type="button"
                onClick={() =>
                  onChange({
                    videoId: it.videoId,
                    title: it.title,
                    url: it.url
                  })
                }
                style={{
                  textAlign: "left",
                  padding: 10,
                  border: "1px solid #eee",
                  borderRadius: 8,
                  background: "white",
                  cursor: "pointer"
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {it.thumbnail ? (
                    <img
                      src={it.thumbnail}
                      alt=""
                      width="60"
                      height="45"
                      style={{ borderRadius: 6, objectFit: "cover" }}
                      loading="lazy"
                    />
                  ) : null}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{it.title}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{it.channelTitle}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

// Simple debounce hook (no external dependency).
function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return useMemo(() => debounced, [debounced]);
}