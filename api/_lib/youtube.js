// YouTube helper that calls YouTube Data API v3.
// We keep it server-side to avoid exposing API keys to the client.

const API_KEY = process.env.YOUTUBE_API_KEY;

export async function youtubeSearch(query) {
  if (!API_KEY) throw new Error("Missing YOUTUBE_API_KEY env var");

  const q = String(query || "").trim();
  if (!q) return [];

  // YouTube search endpoint
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", q);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "8");
  url.searchParams.set("safeSearch", "strict");
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`YouTube API error: ${res.status} ${text}`);
  }

  const data = await res.json();

  return (data.items || [])
    .map((item) => ({
      videoId: item?.id?.videoId,
      title: item?.snippet?.title,
      channelTitle: item?.snippet?.channelTitle,
      thumbnail: item?.snippet?.thumbnails?.default?.url,
      // We embed using the standard YouTube watch URL
      url: item?.id?.videoId ? `https://www.youtube.com/watch?v=${item.id.videoId}` : null
    }))
    .filter((x) => x.videoId && x.title && x.url);
}