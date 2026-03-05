export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type PortalType = "admin" | "logistics";

export type UserProfile = {
  id: string;
  email: string;
  phone_number: string;
  is_verified: boolean;
  first_name: string;
  last_name: string;
  has_kitchen: boolean;
  birthday: string | null;
  referral_code: string | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string | null;
};

export type OtpPayload = {
  phone_number: string;
  otp?: string;
};
