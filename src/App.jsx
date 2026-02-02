import { useState } from "react";
import Composer from "./components/Composer";
import Feed from "./components/Feed";
import PixelCat from "./components/PixelCat";
import { useTheme } from "./contexts/ThemeContext";

export default function App() {
  // When a post is created, bump refreshKey so feed reloads
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Modal state for composer popup (YouTube-style)
  const [showComposer, setShowComposer] = useState(false);

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

  return (
    <>
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
            {/* Animated 8-bit thinking cat */}
            <PixelCat />
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

            {/* Add New Entry button - YouTube style */}
            <button
              type="button"
              onClick={() => setShowComposer(true)}
              style={{
                padding: "10px 20px",
                borderRadius: 20,
                border: "none",
                background: theme.primary,
                color: "white",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => (e.target.style.background = theme.primaryHover)}
              onMouseLeave={(e) => (e.target.style.background = theme.primary)}
            >
              <span style={{ fontSize: 18 }}>+</span>
              Add New Entry
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