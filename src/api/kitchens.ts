import { mockKitchensDb } from "@/data/mockDb";
import type { Kitchen, KitchenUpdatePayload } from "@/types/kitchen";

export const getKitchens = async (): Promise<Kitchen[]> => {
  const data = await mockKitchensDb.fetchAll(1);
  return data.items;
};

export const getKitchen = async (id: string): Promise<Kitchen> => {
  return mockKitchensDb.fetchById(id);
};

export const patchKitchen = async (id: string, payload: KitchenUpdatePayload): Promise<Kitchen> => {
  return mockKitchensDb.updateById(id, payload);
};
