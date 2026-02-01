import { useState } from "react";
import { apiFetch } from "../lib/api";
import YouTubePicker from "./YoutubePicker";
// Create a post with:
// - anonymous toggle
// - name (required when not anonymous)
// - recipient (optional)
// - message (required)
// - optional youtube attachment

export default function Composer({ onPosted }) {
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [youtube, setYoutube] = useState(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    // Client-side validations (fast feedback)
    if (!message.trim()) return setErr("Message is required.");
    if (!anonymous && !name.trim()) return setErr("Name is required if not anonymous.");
    if (message.length > 1000) return setErr("Message is too long.");

    setLoading(true);
    try {
      const payload = {
        anonymous,
        name: name.trim() || undefined,
        recipient: recipient.trim() || undefined,
        message: message.trim(),
        youtube: youtube || undefined
      };

      await apiFetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      // Reset form
      setMessage("");
      setRecipient("");
      setYoutube(null);
      if (anonymous) setName("");

      onPosted?.();
    } catch (e2) {
      // If server returns Zod details, show something useful
      const details = e2?.data?.details;
      if (details?.fieldErrors) {
        const msg =
          Object.values(details.fieldErrors).flat().filter(Boolean)[0] || e2.message;
        setErr(msg);
      } else {
        setErr(e2.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
      <h2 style={{ margin: 0 }}>Freedom Wall</h2>

      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
        />
        Post anonymously
      </label>

      {!anonymous ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={40}
        />
      ) : null}

      <input
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient (optional) e.g. “To: My future self”"
        maxLength={60}
      />

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Share your message..."
        rows={4}
        maxLength={1000}
      />

      <YouTubePicker value={youtube} onChange={setYoutube} />

      {err ? <div style={{ color: "crimson" }}>{err}</div> : null}

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}