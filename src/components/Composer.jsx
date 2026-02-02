import { useState } from "react";
import { apiFetch } from "../lib/api";
import YouTubePicker from "./YouTubePicker";
// Create a post with:
// - anonymous toggle
// - name (required when not anonymous)
// - recipient (optional)
// - message (required)
// - optional youtube attachment

export default function Composer({ onPosted, onCancel }) {
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
    if (!recipient.trim()) return setErr("Recipient is required.");
    if (message.length > 1000) return setErr("Message is too long.");
    if (!youtube) return setErr("YouTube video attachment is required.");

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
    <form
      onSubmit={submit}
      style={{
        display: "grid",
        gap: 16,
        padding: 24
      }}
    >
      {/* Modal Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 16,
          borderBottom: "1px solid #e5e5e5"
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
          Create New Entry
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#606060",
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => (e.target.style.background = "#f2f2f2")}
            onMouseLeave={(e) => (e.target.style.background = "transparent")}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      {/* Form Fields */}
      <label
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          cursor: "pointer"
        }}
      >
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          style={{ width: 18, height: 18, cursor: "pointer" }}
        />
        <span style={{ fontSize: 14 }}>Post anonymously</span>
      </label>

      {/* Conditional name input - only shown when not anonymous */}
      {!anonymous ? (
        <div>
          <label
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
              color: "#0f0f0f"
            }}
          >
            Your Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            maxLength={40}
            style={{
              width: "100%",
              boxSizing: "border-box"
            }}
          />
        </div>
      ) : null}

      {/* Recipient field (required) */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 6,
            color: "#0f0f0f"
          }}
        >
          Recipient <span style={{ color: "#d93025" }}>*</span>
        </label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder='e.g., "To: My future self"'
          maxLength={60}
          style={{
            width: "100%",
            boxSizing: "border-box"
          }}
        />
      </div>

      {/* Message textarea (required) */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 6,
            color: "#0f0f0f"
          }}
        >
          Message <span style={{ color: "#d93025" }}>*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your message..."
          rows={5}
          maxLength={1000}
          style={{
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: "inherit"
          }}
        />
        <div
          style={{
            fontSize: 12,
            color: "#606060",
            marginTop: 4,
            textAlign: "right"
          }}
        >
          {message.length}/1000
        </div>
      </div>

      {/* YouTube Picker Component */}
      <YouTubePicker value={youtube} onChange={setYoutube} />

      {/* Error message display */}
      {err ? (
        <div
          style={{
            color: "#d93025",
            background: "#fce8e6",
            padding: 12,
            borderRadius: 8,
            fontSize: 14
          }}
        >
          {err}
        </div>
      ) : null}

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "flex-end",
          paddingTop: 8
        }}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "10px 20px",
              borderRadius: 20,
              border: "1px solid #ccc",
              background: "white",
              color: "#0f0f0f",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: 14
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 24px",
            borderRadius: 20,
            border: "none",
            background: loading ? "#ccc" : "#065fd4",
            color: "white",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 14,
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.background = "#0553c2";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.background = "#065fd4";
          }}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}