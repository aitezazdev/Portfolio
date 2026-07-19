/**
 * Safe wrapper around sessionStorage to prevent crashes in sandboxed environments,
 * private browsing modes, or browsers with disabled storage/cookies.
 */
export const safeSessionStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        return window.sessionStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[sessionStorage] Failed to get key "${key}":`, e);
    }
    return null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn(`[sessionStorage] Failed to set key "${key}":`, e);
    }
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`[sessionStorage] Failed to remove key "${key}":`, e);
    }
  },
};
