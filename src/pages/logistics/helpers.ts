import type { ComplianceStatus, LogisticsAccountStatus, LogisticsOrderStatus, RiderStatus } from "@/types/logistics";

export const naira = (value: number) => `N${value.toLocaleString()}`;

export const accountStatusColor = (status: LogisticsAccountStatus): "warning" | "success" | "default" => {
  if (status === "approved") return "success";
  if (status === "pending") return "warning";
  return "default";
};

export const complianceColor = (status: ComplianceStatus): "error" | "warning" | "success" => {
  if (status === "approved") return "success";
  if (status === "pending") return "warning";
  return "error";
};

export const riderColor = (status: RiderStatus): "success" | "warning" | "error" => {
  if (status === "active") return "success";
  if (status === "blocked") return "error";
  return "warning";
};

export const orderColor = (status: LogisticsOrderStatus): "info" | "warning" | "primary" | "success" | "default" => {
  if (status === "delivered") return "success";
  if (status === "DELIVERED") return "success";
  if (status === "delivering" || status === "IN_TRANSIT") return "primary";
  if (status === "picked_up" || status === "PICKED_UP" || status === "AWAITING_PICKUP") return "info";
  if (status === "assigned" || status === "ASSIGNED" || status === "PENDING") return "warning";
  return "default";
};

export const statusLabel = (value: string) => value.replace(/_/g, " ").toLowerCase();
