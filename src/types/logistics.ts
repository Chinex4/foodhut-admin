export type LogisticsAccountStatus = "draft" | "pending" | "approved";
export type ComplianceStatus = "missing" | "pending" | "approved";
export type RiderStatus = "active" | "paused";
export type LogisticsOrderStatus = "assigned" | "picked_up" | "delivering" | "paused" | "delivered";

export type LogisticsBusinessAccount = {
  id: string;
  companyName: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  fleetSize: number;
  status: LogisticsAccountStatus;
  createdAt: string;
};

export type ComplianceItem = {
  id: string;
  label: string;
  status: ComplianceStatus;
  updatedAt: string;
};

export type RiderAccount = {
  id: string;
  fullName: string;
  phoneNumber: string;
  bikeType: string;
  plateNumber: string;
  bikeAccountId: string;
  passcodeUpdatedAt: string;
  activeOrders: number;
  earningsToday: number;
  status: RiderStatus;
};

export type LogisticsOrder = {
  id: string;
  riderId: string;
  riderName: string;
  pickup: string;
  dropoff: string;
  amount: number;
  status: LogisticsOrderStatus;
  createdAt: string;
};

export type WalletEntry = {
  id: string;
  label: string;
  amount: number;
  type: "credit" | "debit";
  createdAt: string;
};

export type LogisticsSignupPayload = {
  companyName: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  fleetSize: number;
};

export type RegisterRiderPayload = {
  fullName: string;
  phoneNumber: string;
  bikeType: string;
  plateNumber: string;
  passcode: string;
};
