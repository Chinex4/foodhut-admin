import { api } from "./axios";
import type { Kitchen, KitchenUpdatePayload } from "@/types/kitchen";

export const getKitchens = async (): Promise<Kitchen[]> => {
  const { data } = await api.get<Kitchen[]>("/kitchens");
  return data;
};

export const getKitchen = async (id: string): Promise<Kitchen> => {
  const { data } = await api.get<Kitchen>(`/kitchens/${id}`);
  return data;
};

export const patchKitchen = async (id: string, payload: KitchenUpdatePayload): Promise<Kitchen> => {
  const { data } = await api.put<Kitchen>(`/kitchens/${id}`, payload);
  return data;
};
