export type LogisticsAccountStatus = "draft" | "pending" | "approved";
export type ComplianceStatus = "missing" | "pending" | "approved";
export type RiderStatus = "active" | "paused" | "blocked";
export type LogisticsOrderStatus =
  | "PENDING"
  | "ASSIGNED"
  | "AWAITING_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED"
  | "assigned"
  | "picked_up"
  | "delivering"
  | "paused"
  | "delivered";

export type LogisticsCompany = {
  id: string;
  name: string;
  registration_number: string;
  email: string;
  phone_number: string;
  address: any;
  verification_status: "PENDING" | "VERIFIED" | "REJECTED";
  operations_manager_id?: string;
  created_at?: number | string;
  updated_at?: number | string | null;
  kyc?: any;
};

export type LogisticsDelivery = {
  id: string;
  order_id?: string;
  rider_id?: string | null;
  delivery_status: LogisticsOrderStatus;
  pickup_address?: string;
  dropoff_address?: string;
  delivery_fee?: number | string;
  created_at?: number | string;
  updated_at?: number | string | null;
  rider?: any;
  order?: any;
};

export type LogisticsOffer = {
  id: string;
  order_id: string;
  rider_id: string;
  amount: number;
  status: "PENDING" | "COUNTERED" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  created_at?: number | string;
  updated_at?: number | string | null;
};

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
  raw?: LogisticsCompany;
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
  email?: string;
  bikeType: string;
  plateNumber: string;
  bikeAccountId: string;
  passcodeUpdatedAt: string;
  activeOrders: number;
  earningsToday: number;
  status: RiderStatus;
  kycId?: string;
  kycStatus?: "pending" | "approved" | "rejected";
  raw?: any;
};

export type LogisticsOrder = {
  id: string;
  deliveryId?: string;
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
  email: string;
  phoneNumber: string;
  bikeType: string;
  plateNumber: string;
  passcode: string;
};
