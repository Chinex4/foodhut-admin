import type { DashboardAnalyticsPoint, DashboardInfo } from "@/types/dashboard";
import { mockDashboard } from "@/data/mockDb";

export const getDashboardInfo = async (): Promise<DashboardInfo> => {
  return mockDashboard.getInfo();
};

export const getDashboardAnalytics = async (): Promise<DashboardAnalyticsPoint[]> => {
  return mockDashboard.getAnalytics();
};
