export type RiderKycStatus = "pending" | "approved" | "rejected";

export type RiderStatus = "active" | "offline" | "blocked";

export type Rider = {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  city: string;
  area: string;
  vehicle_type: string;
  plate_number: string;
  status: RiderStatus;
  kyc_status: RiderKycStatus;
  completed_orders: number;
  rating: number;
  current_location: string;
  profile_image_url?: string;
  kyc_documents: string[];
  created_at: string;
};
