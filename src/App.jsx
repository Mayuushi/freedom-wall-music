import { useState } from "react";
import Composer from "./components/Composer";
import Feed from "./components/Feed";

export default function App() {
  // When a post is created, bump refreshKey so feed reloads
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: 16,
        display: "grid",
        gap: 16
      }}
    >
      <Composer onPosted={() => setRefreshKey((x) => x + 1)} />
      <Feed refreshKey={refreshKey} />
    </div>
  );
}