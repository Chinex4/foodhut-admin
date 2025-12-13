export type Ad = {
  id: string;
  title: string;
  image_url?: string;
  link?: string;
  is_active: boolean;
  created_at?: string;
};

export type AdPayload = Omit<Ad, "id" | "created_at">;
