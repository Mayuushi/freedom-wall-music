// Central fetch helper:
// - consistent error handling
// - timeouts
// - JSON parsing
// - keeps components clean

export async function apiFetch(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new DOMException("Request timed out", "TimeoutError")), 15_000);

  try {
    const res = await fetch(path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message = data?.message || data?.error || `Request failed (${res.status})`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (err?.name === "AbortError" || err?.name === "TimeoutError") {
      throw new Error("Request timed out while waiting for the server.");
    }

    throw err;
  } finally {
    clearTimeout(timeout);
  }
}