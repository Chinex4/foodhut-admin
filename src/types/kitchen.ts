export type Kitchen = {
  id: string;
  name: string;
  city: string | { name?: string; state?: string; [key: string]: unknown };
  address: string;
  cover_image?: { url?: string; [key: string]: unknown } | null;
  phone_number?: string;
  type?: string;
  rating?: string | number;
  likes?: number;
  opening_time?: string;
  closing_time?: string;
  delivery_time?: string;
  preparation_time?: string;
  description?: string;
  cover_image_url?: string;
  is_blocked: boolean;
  is_verified: boolean;
  owner?: string;
  created_at?: string;
};

export type KitchenUpdatePayload = Partial<Omit<Kitchen, "id">>;
