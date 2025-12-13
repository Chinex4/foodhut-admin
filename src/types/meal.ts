export type Meal = {
  id: string;
  name: string;
  price: number | string;
  original_price?: number | string;
  kitchen_id: string;
  description?: string;
  cover_image?: { url?: string; [key: string]: unknown } | null;
  image_url?: string;
  is_available?: boolean;
  rating?: string | number;
  created_at?: string;
  updated_at?: string | null;
};

export type MealPayload = Omit<Meal, "id" | "created_at">;
