import axios from "axios";
import { API_BASE_URL } from "./config";
import { tokenStorage } from "@/lib/tokenStorage";
import type { AppDispatch, RootState } from "@/store";
import type { AuthTokens } from "@/types/auth";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupAxiosInterceptors = (store: { dispatch: AppDispatch; getState: () => RootState }) => {
  api.interceptors.request.use((config) => {
    const token = tokenStorage.get()?.access_token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refresh = tokenStorage.get()?.refresh_token;
        if (!refresh) {
          store.dispatch({ type: "auth/logout" });
          return Promise.reject(error);
        }
        try {
          const { data } = await api.post<AuthTokens>("/auth/refresh", { token: refresh });
          tokenStorage.set(data);
          store.dispatch({ type: "auth/setTokens", payload: data });
          if (data.access_token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          store.dispatch({ type: "auth/logout" });
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );
};
