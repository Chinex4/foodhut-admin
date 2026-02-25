export type AreaCity = {
  id: string;
  city: string;
  area: string;
  is_active: boolean;
  created_at: string;
};

export type AreaCityPayload = {
  city: string;
  area: string;
};
