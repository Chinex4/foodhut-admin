import type { AuthTokens } from "@/types/auth";

const ACCESS_KEY = "foodhut_access_token";
const REFRESH_KEY = "foodhut_refresh_token";

export const tokenStorage = {
  set(tokens: AuthTokens) {
    localStorage.setItem(ACCESS_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
  },
  get(): AuthTokens | null {
    const access_token = localStorage.getItem(ACCESS_KEY);
    const refresh_token = localStorage.getItem(REFRESH_KEY);
    if (!access_token || !refresh_token) return null;
    return { access_token, refresh_token };
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
