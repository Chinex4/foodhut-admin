const envBase = import.meta?.env?.VITE_API_BASE_URL;
export const API_BASE_URL = envBase || "https://foodhut.fly.dev/api";
