import { useTheme } from "../contexts/ThemeContext";

/**
 * CalmBackground Component
 * Renders a nature-themed SVG background with mountains, clouds, and stars
 * Adapts colors based on light/dark mode for a calming aesthetic
 */
export default function CalmBackground() {
  const { isDarkMode } = useTheme();

  // Color schemes for light and dark modes
  const colors = isDarkMode
    ? {
        // Dark mode: Night scene
        sky: "#0a0e27",
        skyGradient: "#1a1f3a",
        mountain1: "#1e2d4a",
        mountain2: "#2a3f5f",
        mountain3: "#364a6b",
        cloud1: "rgba(200, 220, 255, 0.08)",
        cloud2: "rgba(200, 220, 255, 0.05)",
        stars: "rgba(255, 255, 255, 0.6)",
        moon: "rgba(255, 250, 230, 0.9)",
        treeDark: "#0f1828",
        treeLight: "#1a2332"
      }
    : {
        // Light mode: Day scene
        sky: "#e8f4f8",
        skyGradient: "#b8d8e8",
        mountain1: "#8fa8b4",
        mountain2: "#a8bcc5",
        mountain3: "#c5d5db",
        cloud1: "rgba(255, 255, 255, 0.9)",
        cloud2: "rgba(255, 255, 255, 0.7)",
        stars: "rgba(255, 255, 255, 0)", // No stars in day mode
        moon: "rgba(255, 252, 230, 0.8)", // Subtle sun glow
        treeDark: "#6b8a95",
        treeLight: "#8fa8b4"
      };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none" // Ensure background doesn't interfere with interactions
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky gradient background */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.sky, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.skyGradient, stopOpacity: 1 }} />
          </linearGradient>

          {/* Cloud pattern for texture */}
          <filter id="cloudBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Sky */}
        <rect width="1920" height="1080" fill="url(#skyGradient)" />

        {/* Stars (visible in dark mode only) */}
        {isDarkMode && (
          <g opacity="1">
            {/* Randomly positioned stars */}
            {[...Array(80)].map((_, i) => {
              const x = (i * 137.5) % 1920; // Pseudo-random positioning
              const y = (i * 234.7) % 600;
              const size = 1 + (i % 3) * 0.5;
              const opacity = 0.3 + (i % 7) / 10;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={size}
                  fill={colors.stars}
                  opacity={opacity}
                >
                  {/* Twinkling animation for some stars */}
                  {i % 5 === 0 && (
                    <animate
                      attributeName="opacity"
                      values={`${opacity};${opacity * 0.3};${opacity}`}
                      dur={`${3 + (i % 4)}s`}
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              );
            })}
          </g>
        )}

        {/* Moon/Sun glow */}
        <circle cx="1650" cy="200" r="60" fill={colors.moon} opacity="0.6">
          <animate
            attributeName="opacity"
            values="0.5;0.7;0.5"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Clouds - floating in the background */}
        <g opacity="0.8" filter="url(#cloudBlur)">
          {/* Cloud 1 */}
          <ellipse cx="300" cy="150" rx="120" ry="40" fill={colors.cloud1} />
          <ellipse cx="250" cy="160" rx="80" ry="35" fill={colors.cloud1} />
          <ellipse cx="350" cy="165" rx="90" ry="30" fill={colors.cloud1} />

          {/* Cloud 2 */}
          <ellipse cx="800" cy="250" rx="140" ry="45" fill={colors.cloud2} />
          <ellipse cx="750" cy="265" rx="100" ry="40" fill={colors.cloud2} />
          <ellipse cx="870" cy="270" rx="110" ry="35" fill={colors.cloud2} />

          {/* Cloud 3 */}
          <ellipse cx="1400" cy="180" rx="130" ry="42" fill={colors.cloud1} />
          <ellipse cx="1350" cy="195" rx="95" ry="38" fill={colors.cloud1} />
          <ellipse cx="1470" cy="200" rx="105" ry="33" fill={colors.cloud1} />

          {/* Cloud 4 */}
          <ellipse cx="1100" cy="320" rx="100" ry="35" fill={colors.cloud2} />
          <ellipse cx="1060" cy="330" rx="70" ry="30" fill={colors.cloud2} />
        </g>

        {/* Mountain layers - creating depth with multiple layers */}
        
        {/* Distant mountains (smallest, lightest) */}
        <path
          d="M 0 650 Q 300 550 600 600 T 1200 580 T 1920 620 L 1920 1080 L 0 1080 Z"
          fill={colors.mountain3}
          opacity="0.6"
        />

        {/* Mid-distance mountains */}
        <path
          d="M 0 700 Q 250 580 500 650 Q 750 720 1000 670 Q 1250 620 1500 690 Q 1750 760 1920 700 L 1920 1080 L 0 1080 Z"
          fill={colors.mountain2}
          opacity="0.75"
        />

        {/* Foreground mountains (largest, darkest) */}
        <path
          d="M 0 800 L 300 650 L 450 720 L 650 600 L 850 750 L 1100 680 L 1350 780 L 1600 720 L 1920 820 L 1920 1080 L 0 1080 Z"
          fill={colors.mountain1}
          opacity="0.9"
        />

        {/* Foreground trees for added depth (simple triangular shapes) */}
        <g opacity="0.7">
          {/* Left side tree cluster */}
          <path d="M 100 950 L 150 850 L 200 950 Z" fill={colors.treeDark} />
          <path d="M 120 920 L 150 870 L 180 920 Z" fill={colors.treeLight} />
          <rect x="145" y="950" width="10" height="60" fill={colors.treeDark} opacity="0.8" />

          {/* Another tree */}
          <path d="M 50 980 L 85 900 L 120 980 Z" fill={colors.treeDark} />
          <rect x="80" y="980" width="10" height="50" fill={colors.treeDark} opacity="0.8" />

          {/* Right side tree cluster */}
          <path d="M 1750 970 L 1800 880 L 1850 970 Z" fill={colors.treeDark} />
          <path d="M 1770 940 L 1800 900 L 1830 940 Z" fill={colors.treeLight} />
          <rect x="1795" y="970" width="10" height="55" fill={colors.treeDark} opacity="0.8" />

          {/* Additional small trees */}
          <path d="M 1680 1000 L 1710 940 L 1740 1000 Z" fill={colors.treeDark} />
          <rect x="1705" y="1000" width="10" height="40" fill={colors.treeDark} opacity="0.8" />
        </g>

        {/* Subtle fog/mist effect at the bottom */}
        <rect
          x="0"
          y="900"
          width="1920"
          height="180"
          fill="url(#mistGradient)"
          opacity="0.3"
        />
        <defs>
          <linearGradient id="mistGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.cloud2, stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: colors.cloud1, stopOpacity: 0.4 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
