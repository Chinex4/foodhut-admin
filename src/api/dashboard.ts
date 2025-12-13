import { api } from "./axios";
import type { DashboardAnalyticsPoint, DashboardInfo } from "@/types/dashboard";

export const getDashboardInfo = async (): Promise<DashboardInfo> => {
  const { data } = await api.get<DashboardInfo>("/dashboard/info");
  return data;
};

export const getDashboardAnalytics = async (): Promise<DashboardAnalyticsPoint[]> => {
  const { data } = await api.get<DashboardAnalyticsPoint[]>("/dashboard/analytics");
  return data;
};
