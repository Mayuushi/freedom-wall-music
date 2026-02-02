import { useTheme } from "../contexts/ThemeContext";

/**
 * 8-bit Pixel Art Thinking Cat
 * Animated CSS-based pixel art cat
 */
export default function PixelCat() {
  const { theme, isDarkMode } = useTheme();
  
  // Cat color palette
  const catColor = isDarkMode ? "#FFB86C" : "#FF8C42";
  const catDark = isDarkMode ? "#D68A4D" : "#CC6633";
  const eyeColor = "#2E3440";
  const noseColor = "#FF6B9D";
  
  // Pixel size
  const px = 3;
  
  // Helper to create a pixel
  const Pixel = ({ color, style = {} }) => (
    <div
      style={{
        width: px,
        height: px,
        backgroundColor: color,
        ...style
      }}
    />
  );
  
  return (
    <div
      style={{
        display: "inline-block",
        animation: "catThinking 2s ease-in-out infinite",
        imageRendering: "pixelated"
      }}
    >
      {/* Cat pixel art grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(16, ${px}px)`,
          gap: 0,
          lineHeight: 0
        }}
      >
        {/* Row 1 - Ears */}
        <Pixel /><Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel /><Pixel />
        
        {/* Row 2 - Ears */}
        <Pixel /><Pixel color={catColor} /><Pixel color={catDark} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catDark} /><Pixel color={catColor} /><Pixel /><Pixel />
        
        {/* Row 3 - Top of head */}
        <Pixel color={catColor} /><Pixel color={catDark} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel /><Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catDark} /><Pixel color={catColor} /><Pixel />
        
        {/* Row 4 - Head */}
        <Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel />
        
        {/* Row 5 - Eyes row */}
        <Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={eyeColor} /><Pixel color={eyeColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={eyeColor} /><Pixel color={eyeColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel />
        
        {/* Row 6 - Eyes highlight */}
        <Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={eyeColor} /><Pixel color={eyeColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={eyeColor} /><Pixel color={eyeColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel />
        
        {/* Row 7 - Cheeks */}
        <Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catDark} /><Pixel color={catDark} /><Pixel color={catDark} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel />
        
        {/* Row 8 - Nose */}
        <Pixel /><Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={noseColor} /><Pixel color={noseColor} /><Pixel color={noseColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel /><Pixel />
        
        {/* Row 9 - Mouth */}
        <Pixel /><Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={eyeColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel /><Pixel />
        
        {/* Row 10 - Chin */}
        <Pixel /><Pixel /><Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel /><Pixel /><Pixel />
        
        {/* Row 11 - Bottom */}
        <Pixel /><Pixel /><Pixel /><Pixel /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel color={catColor} /><Pixel /><Pixel /><Pixel /><Pixel /><Pixel />
      </div>
    </div>
  );
}
