/**
 * IndexNow Integration
 * Submits URLs to IndexNow API (Bing, Yandex, etc.) for instant indexing.
 * Requires INDEXNOW_KEY and BASE_URL in environment variables.
 */

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export async function submitToIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  const baseUrl = process.env.BASE_URL;

  if (!key) {
    console.warn("[IndexNow] INDEXNOW_KEY not set, skipping submission.");
    return;
  }
  if (!baseUrl) {
    console.warn("[IndexNow] BASE_URL not set, skipping submission.");
    return;
  }
  if (!urls.length) return;

  const host = new URL(baseUrl).hostname;
  const keyLocation = `${baseUrl}/${key}.txt`;

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: urls,
      }),
    });

    if (res.ok || res.status === 202) {
      console.log(`[IndexNow] Submitted ${urls.length} URL(s). Status: ${res.status}`);
    } else {
      const text = await res.text();
      console.error(`[IndexNow] Submission failed. Status: ${res.status}. Body: ${text}`);
    }
  } catch (err) {
    console.error("[IndexNow] Network error during submission:", err);
  }
}
