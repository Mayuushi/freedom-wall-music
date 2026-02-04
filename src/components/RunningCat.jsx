import { useTheme } from "../contexts/ThemeContext";

/**
 * Running Cat Animation
 * Animated cat that runs when loading, otherwise just wags tail
 */
export default function RunningCat({ loading = false }) {
  const { theme } = useTheme();
  
  // Cat color palette based on theme
  const catColor = theme.isDarkMode ? "#FFB86C" : "#FF8C42";
  const catDark = theme.isDarkMode ? "#D68A4D" : "#CC6633";
  const eyeColor = "#2E3440";
  
  return (
    <div
      style={{
        display: "inline-block",
        width: 60,
        height: 50
      }}
    >
      <svg
        width="60"
        height="50"
        viewBox="0 0 100 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* Cat body */}
        <ellipse
          cx="50"
          cy="40"
          rx="30"
          ry="20"
          fill={catColor}
          stroke={catDark}
          strokeWidth="2"
        />
        
        {/* Cat head */}
        <circle
          cx="70"
          cy="30"
          r="18"
          fill={catColor}
          stroke={catDark}
          strokeWidth="2"
        />
        
        {/* Left ear */}
        <path
          d="M 60 16 L 56 6 L 66 12 Z"
          fill={catColor}
          stroke={catDark}
          strokeWidth="1.5"
        />
        
        {/* Right ear */}
        <path
          d="M 80 16 L 84 6 L 74 12 Z"
          fill={catColor}
          stroke={catDark}
          strokeWidth="1.5"
        />
        
        {/* Left eye */}
        <circle cx="64" cy="28" r="2.5" fill={eyeColor} />
        
        {/* Right eye */}
        <circle cx="76" cy="28" r="2.5" fill={eyeColor} />
        
        {/* Nose */}
        <circle cx="70" cy="34" r="2" fill="#FF6B9D" />
        
        {/* Tail - always wagging */}
        <path
          d="M 20 35 Q 10 20 15 10"
          stroke={catDark}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        >
          <animate
            attributeName="d"
            values="M 20 35 Q 10 20 15 10; M 20 35 Q 10 50 15 60; M 20 35 Q 10 20 15 10"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Front left leg */}
        <line
          x1="55"
          y1="55"
          x2="55"
          y2="70"
          stroke={catDark}
          strokeWidth="3"
          strokeLinecap="round"
        >
          {loading && (
            <animate
              attributeName="y2"
              values="70;62;70"
              dur="0.3s"
              repeatCount="indefinite"
            />
          )}
        </line>
        
        {/* Front right leg */}
        <line
          x1="65"
          y1="55"
          x2="65"
          y2="70"
          stroke={catDark}
          strokeWidth="3"
          strokeLinecap="round"
        >
          {loading && (
            <animate
              attributeName="y2"
              values="62;70;62"
              dur="0.3s"
              repeatCount="indefinite"
            />
          )}
        </line>
        
        {/* Back left leg */}
        <line
          x1="35"
          y1="55"
          x2="35"
          y2="70"
          stroke={catDark}
          strokeWidth="3"
          strokeLinecap="round"
        >
          {loading && (
            <animate
              attributeName="y2"
              values="62;70;62"
              dur="0.3s"
              repeatCount="indefinite"
            />
          )}
        </line>
        
        {/* Back right leg */}
        <line
          x1="45"
          y1="55"
          x2="45"
          y2="70"
          stroke={catDark}
          strokeWidth="3"
          strokeLinecap="round"
        >
          {loading && (
            <animate
              attributeName="y2"
              values="70;62;70"
              dur="0.3s"
              repeatCount="indefinite"
            />
          )}
        </line>
      </svg>
    </div>
  );
}
