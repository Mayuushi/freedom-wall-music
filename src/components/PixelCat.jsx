import { useTheme } from "../contexts/ThemeContext";

/**
 * SVG Cat Logo
 * Cute animated cat that adapts to theme
 */
export default function PixelCat() {
  const { isDarkMode } = useTheme();
  
  // Cat color palette based on theme
  const catColor = isDarkMode ? "#FFB86C" : "#FF8C42";
  const catDark = isDarkMode ? "#D68A4D" : "#CC6633";
  const eyeColor = "#2E3440";
  const noseColor = "#FF6B9D";
  const whiskerColor = isDarkMode ? "#FFD4A3" : "#CC6633";
  
  return (
    <div
      style={{
        display: "inline-block",
        animation: "catThinking 2s ease-in-out infinite",
        width: 48,
        height: 48
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* Left ear */}
        <path
          d="M 12 18 L 8 8 L 18 14 Z"
          fill={catColor}
          stroke={catDark}
          strokeWidth="1.5"
        />
        
        {/* Right ear */}
        <path
          d="M 52 18 L 56 8 L 46 14 Z"
          fill={catColor}
          stroke={catDark}
          strokeWidth="1.5"
        />
        
        {/* Head circle */}
        <circle
          cx="32"
          cy="32"
          r="20"
          fill={catColor}
          stroke={catDark}
          strokeWidth="2"
        />
        
        {/* Left eye */}
        <ellipse
          cx="24"
          cy="28"
          rx="3"
          ry="5"
          fill={eyeColor}
        >
          <animate
            attributeName="ry"
            values="5;0.5;5"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>
        
        {/* Right eye */}
        <ellipse
          cx="40"
          cy="28"
          rx="3"
          ry="5"
          fill={eyeColor}
        >
          <animate
            attributeName="ry"
            values="5;0.5;5"
            dur="3s"
            repeatCount="indefinite"
          />
        </ellipse>
        
        {/* Eye highlights */}
        <circle cx="25" cy="26" r="1.5" fill="white" opacity="0.8" />
        <circle cx="41" cy="26" r="1.5" fill="white" opacity="0.8" />
        
        {/* Nose */}
        <path
          d="M 32 34 L 30 38 L 34 38 Z"
          fill={noseColor}
        />
        
        {/* Mouth */}
        <path
          d="M 32 38 Q 28 42 24 40"
          stroke={catDark}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 32 38 Q 36 42 40 40"
          stroke={catDark}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Left whiskers */}
        <line x1="14" y1="32" x2="4" y2="30" stroke={whiskerColor} strokeWidth="1" strokeLinecap="round" />
        <line x1="14" y1="34" x2="4" y2="36" stroke={whiskerColor} strokeWidth="1" strokeLinecap="round" />
        <line x1="16" y1="36" x2="6" y2="40" stroke={whiskerColor} strokeWidth="1" strokeLinecap="round" />
        
        {/* Right whiskers */}
        <line x1="50" y1="32" x2="60" y2="30" stroke={whiskerColor} strokeWidth="1" strokeLinecap="round" />
        <line x1="50" y1="34" x2="60" y2="36" stroke={whiskerColor} strokeWidth="1" strokeLinecap="round" />
        <line x1="48" y1="36" x2="58" y2="40" stroke={whiskerColor} strokeWidth="1" strokeLinecap="round" />
        
        {/* Cheek blush - left */}
        <ellipse
          cx="18"
          cy="36"
          rx="4"
          ry="3"
          fill={noseColor}
          opacity="0.3"
        />
        
        {/* Cheek blush - right */}
        <ellipse
          cx="46"
          cy="36"
          rx="4"
          ry="3"
          fill={noseColor}
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
