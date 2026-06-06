const CACHE_EXPIRATION_MS = 1000 * 60 * 5; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const apiCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<unknown>>();

export async function fetchWithCache<T>(
  url: string,
  fetchFn: () => Promise<T>,
  expirationMs: number = CACHE_EXPIRATION_MS
): Promise<T> {
  const now = Date.now();
  const cached = apiCache.get(url);

  if (cached && now - cached.timestamp < expirationMs) {
    return cached.data as T;
  }

  // Deduplicate inflight requests
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url) as Promise<T>;
  }

  const requestPromise = fetchFn()
    .then((data) => {
      apiCache.set(url, { data, timestamp: Date.now() });
      pendingRequests.delete(url);
      return data;
    })
    .catch((err) => {
      pendingRequests.delete(url);
      throw err;
    });

  pendingRequests.set(url, requestPromise);
  return requestPromise;
}

export function clearCache() {
  apiCache.clear();
  pendingRequests.clear();
}
