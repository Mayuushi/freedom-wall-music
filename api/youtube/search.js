import { handleOptions, sendJson } from "../_lib/http.js";
import { youtubeSearch } from "../_lib/youtube.js";

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;

  try {
    if (req.method !== "GET") {
      return sendJson(res, 405, { error: "Method not allowed" });
    }

    const url = new URL(req.url, "http://localhost");
    const q = url.searchParams.get("q") || "";

    // Basic anti-abuse:
    // - block super short queries (low signal, can cause spam calls)
    // - cap length
    const query = q.trim().slice(0, 80);
    if (query.length < 2) {
      return sendJson(res, 200, { items: [] });
    }

    const items = await youtubeSearch(query);
    return sendJson(res, 200, { items });
  } catch (err) {
    return sendJson(res, 500, {
      error: "YouTube search failed",
      message: String(err?.message || err)
    });
  }
}