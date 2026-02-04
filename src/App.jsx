import { useState } from "react";
import Composer from "./components/Composer";
import Feed from "./components/Feed";
import RunningCat from "./components/RunningCat";
import CalmBackground from "./components/CalmBackground";
import { useTheme } from "./contexts/ThemeContext";

export default function App() {
  // When a post is created, bump refreshKey so feed reloads
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Modal state for composer popup (YouTube-style)
  const [showComposer, setShowComposer] = useState(false);
  
  // Loading state for refresh
  const [loading, setLoading] = useState(false);

  // Access theme context
  const { theme, isDarkMode, toggleDarkMode } = useTheme();

  /**
   * Handle successful post submission
   * Closes modal and triggers feed refresh
   */
  const handlePosted = () => {
    setRefreshKey((x) => x + 1);
    setShowComposer(false);
  };

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((x) => x + 1);
    // Reset loading after a short delay
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <>
      {/* Calm nature background - adapts to light/dark mode */}
      <CalmBackground />

      {/* Fixed header with YouTube-inspired design */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
          boxShadow: isDarkMode ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 2px rgba(0,0,0,0.05)"
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16
          }}
        >
          {/* Logo/Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <RunningCat loading={loading} />
            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: theme.textPrimary
              }}
            >
              Freedom Wall
            </div>
          </div>

          {/* Action buttons container */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Dark mode toggle button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              style={{
                padding: "10px",
                borderRadius: "50%",
                border: "none",
                background: theme.surfaceHover,
                color: theme.textPrimary,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                fontSize: 20,
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => (e.target.style.background = theme.border)}
              onMouseLeave={(e) => (e.target.style.background = theme.surfaceHover)}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>

            {/* Refresh button with SVG icon */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "none",
                background: theme.surfaceHover,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                opacity: loading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = theme.border;
                  e.target.style.transform = "rotate(180deg)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = theme.surfaceHover;
                  e.target.style.transform = "rotate(0deg)";
                }
              }}
              aria-label="Refresh feed"
              title="Refresh feed"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  animation: loading ? "spin 1s linear infinite" : "none"
                }}
              >
                <path
                  d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.89604 17.9923 5.34372M21 3V9M21 9H15M21 9L17.9923 5.34372"
                  stroke={theme.textPrimary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Add New Entry button - Animated + icon */}
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                border: "none",
                background: theme.primary,
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme.primaryHover;
                e.target.style.transform = "rotate(90deg) scale(1.1)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = theme.primary;
                e.target.style.transform = "rotate(0deg) scale(1)";
                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
              }}
              aria-label="Add New Entry"
              title="Add New Entry"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "24px"
        }}
      >
        <Feed refreshKey={refreshKey} />
      </main>

      {/* Global styles for animations */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Modal overlay for Composer (pops out when "Add New Entry" is clicked) */}
      {showComposer && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.modalBackdrop,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16
          }}
          onClick={(e) => {
            // Close modal when clicking backdrop (not the modal content)
            if (e.target === e.currentTarget) setShowComposer(false);
          }}
        >
          <div
            style={{
              background: theme.surface,
              borderRadius: 12,
              maxWidth: 720,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: isDarkMode ? "0 8px 32px rgba(0, 0, 0, 0.6)" : "0 8px 32px rgba(0, 0, 0, 0.3)"
            }}
          >
            <Composer
              onPosted={handlePosted}
              onCancel={() => setShowComposer(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}