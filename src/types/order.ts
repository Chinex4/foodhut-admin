import type { Meal } from "./meal";
import type { Rider } from "./rider";

export type OrderItem = {
  meal_id: string;
  meal?: Meal;
  price: string | number;
  quantity: number;
};

export type Order = {
  id: string;
  kitchen_id: string;
  kitchen?: {
    name?: string;
    address?: string;
    phone_number?: string;
    type?: string;
    city?: { name?: string; state?: string; [key: string]: unknown } | string | null;
    [key: string]: unknown;
  };
  rider?: Pick<Rider, "id" | "full_name" | "phone_number" | "vehicle_type" | "plate_number" | "kyc_status" | "status"> | null;
  pickup_location?: string;
  dropoff_location?: string;
  owner_id?: string;
  owner?: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
    [key: string]: unknown;
  } | null;
  items: OrderItem[];
  status: string;
  total: string | number;
  sub_total?: string | number;
  service_fee?: string | number;
  delivery_fee?: string | number;
  payment_method?: string;
  delivery_address?: string;
  dispatch_rider_note?: string | null;
  delivery_date?: string | null;
  created_at?: string;
  updated_at?: string | null;
};
