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

const getRequestLabel = (config?: { method?: string; baseURL?: string; url?: string }) => {
  const method = (config?.method || "GET").toUpperCase();
  const url = `${config?.baseURL ?? ""}${config?.url ?? ""}`;
  return `${method} ${url}`;
};

export const setupAxiosInterceptors = (store: { dispatch: AppDispatch; getState: () => RootState }) => {
  api.interceptors.request.use((config) => {
    const token = tokenStorage.get()?.access_token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("[API REQUEST]", getRequestLabel(config), {
      params: config.params,
      data: config.data,
    });
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      console.log("[API RESPONSE]", getRequestLabel(response.config), {
        status: response.status,
        data: response.data,
      });
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      console.log("[API ERROR]", getRequestLabel(error.config), {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
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
