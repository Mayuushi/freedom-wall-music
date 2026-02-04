import { createContext, useContext, useEffect, useState } from "react";

// Create theme context
const ThemeContext = createContext();

// Theme configuration
export const themes = {
  light: {
    // Background colors
    background: "rgba(249, 249, 249, 0.95)",
    surface: "rgba(255, 255, 255, 0.95)",
    surfaceHover: "rgba(248, 248, 248, 0.95)",
    
    // Text colors
    textPrimary: "#0f0f0f",
    textSecondary: "#606060",
    textTertiary: "#909090",
    
    // Border colors
    border: "#e5e5e5",
    borderLight: "#ddd",
    
    // Accent colors
    primary: "#065fd4",
    primaryHover: "#0553c2",
    primaryBg: "rgba(6, 95, 212, 0.1)",
    danger: "#d93025",
    dangerBg: "#fce8e6",
    
    // Component specific
    modalBackdrop: "rgba(0, 0, 0, 0.5)",
    scrollbarThumb: "#909090",
    scrollbarThumbHover: "#606060",
    
    // Gradients
    avatarAnonymous: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    avatarNamed: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  dark: {
    // Background colors
    background: "rgba(15, 15, 15, 0.95)",
    surface: "rgba(31, 31, 31, 0.95)",
    surfaceHover: "rgba(42, 42, 42, 0.95)",
    
    // Text colors
    textPrimary: "#f1f1f1",
    textSecondary: "#aaaaaa",
    textTertiary: "#717171",
    
    // Border colors
    border: "#3a3a3a",
    borderLight: "#2a2a2a",
    
    // Accent colors
    primary: "#3ea6ff",
    primaryHover: "#65b8ff",
    primaryBg: "rgba(62, 166, 255, 0.15)",
    danger: "#ff5555",
    dangerBg: "#3a1f1f",
    
    // Component specific
    modalBackdrop: "rgba(0, 0, 0, 0.8)",
    scrollbarThumb: "#717171",
    scrollbarThumbHover: "#aaaaaa",
    
    // Gradients
    avatarAnonymous: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    avatarNamed: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  }
};

/**
 * Theme Provider Component
 * Manages dark mode state and persistence
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      return stored === "true";
    }
    // Check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const theme = isDarkMode ? themes.dark : themes.light;

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("darkMode", newValue);
      return newValue;
    });
  };

  // Update document background color when theme changes
  useEffect(() => {
    // Make background transparent to show the CalmBackground component
    document.body.style.background = "transparent";
    document.body.style.color = theme.textPrimary;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * @returns {Object} { theme, isDarkMode, toggleDarkMode }
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
