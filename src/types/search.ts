import type { Meal } from "./meal";
import type { Kitchen } from "./kitchen";

export type SearchResults = {
  items: Array<Meal | Kitchen>;
  meta?: { page: number; per_page: number; total: number };
  meals?: Meal[];
  kitchens?: Kitchen[];
};
