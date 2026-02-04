import { useState } from "react";
import { apiFetch } from "../lib/api";
import YouTubePicker from "./YouTubePicker";
import { useTheme } from "../contexts/ThemeContext";
import { AVATARS, DEFAULT_AVATAR_ID } from "../lib/avatars";
// Create a post with:
// - anonymous toggle
// - name (required when not anonymous)
// - recipient (required)
// - message (required)
// - youtube attachment (required)
// - avatar selection (optional, defaults to 'barbarian')

export default function Composer({ onPosted, onCancel }) {
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [youtube, setYoutube] = useState(null);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR_ID); // Avatar state

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Access theme
  const { theme } = useTheme();

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
        youtube: youtube || undefined,
        avatar: avatar || DEFAULT_AVATAR_ID // Include selected avatar
      };

      await apiFetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      // Reset form
      setMessage("");
      setRecipient("");
      setYoutube(null);
      setAvatar(DEFAULT_AVATAR_ID); // Reset avatar to default
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
          borderBottom: `1px solid ${theme.border}`
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: theme.textPrimary }}>
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
              color: theme.textPrimary
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
              boxSizing: "border-box",
              background: theme.surface,
              color: theme.textPrimary,
              border: `1px solid ${theme.borderLight}`
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
            color: theme.textPrimary
          }}
        >
          Recipient <span style={{ color: theme.danger }}>*</span>
        </label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder='e.g., "To: My future self"'
          maxLength={60}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: theme.surface,
            color: theme.textPrimary,
            border: `1px solid ${theme.borderLight}`
          }}
        />
      </div>

      {/* Avatar Selection */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 8,
            color: theme.textPrimary
          }}
        >
          Choose Your Avatar
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(60px, 1fr))",
            gap: 8,
            padding: 8,
            background: theme.surface,
            borderRadius: 8,
            border: `1px solid ${theme.borderLight}`
          }}
        >
          {AVATARS.map((av) => (
            <button
              key={av.id}
              type="button"
              onClick={() => setAvatar(av.id)}
              style={{
                width: "100%",
                aspectRatio: "1",
                padding: 8,
                borderRadius: 8,
                border: avatar === av.id 
                  ? `2px solid ${theme.primary}` 
                  : `1px solid ${theme.borderLight}`,
                background: avatar === av.id 
                  ? theme.primaryBg 
                  : theme.surface,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4
              }}
              onMouseEnter={(e) => {
                if (avatar !== av.id) {
                  e.currentTarget.style.background = theme.surfaceHover;
                  e.currentTarget.style.borderColor = theme.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (avatar !== av.id) {
                  e.currentTarget.style.background = theme.surface;
                  e.currentTarget.style.borderColor = theme.borderLight;
                }
              }}
              title={av.name}
            >
              <img 
                src={av.icon} 
                alt={av.name} 
                style={{ 
                  width: "100%", 
                  height: "auto",
                  maxWidth: 40,
                  opacity: avatar === av.id ? 1 : 0.7
                }} 
              />
              <span 
                style={{ 
                  fontSize: 10, 
                  color: avatar === av.id ? theme.primary : theme.textSecondary,
                  fontWeight: avatar === av.id ? 600 : 400,
                  textAlign: "center",
                  lineHeight: 1
                }}
              >
                {av.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Message textarea (required) */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 6,
            color: theme.textPrimary
          }}
        >
          Message <span style={{ color: theme.danger }}>*</span>
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
            fontFamily: "inherit",
            background: theme.surface,
            color: theme.textPrimary,
            border: `1px solid ${theme.borderLight}`
          }}
        />
        <div
          style={{
            fontSize: 12,
            color: theme.textSecondary,
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
            color: theme.danger,
            background: theme.dangerBg,
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
              border: `1px solid ${theme.borderLight}`,
              background: theme.surface,
              color: theme.textPrimary,
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
            background: loading ? theme.borderLight : theme.primary,
            color: "white",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 14,
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.background = theme.primaryHover;
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.background = theme.primary;
          }}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}