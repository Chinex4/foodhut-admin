import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import type { Meal, MealPayload } from "@/types/meal";
import type { RootState } from "..";

type MealsState = {
  items: Meal[];
  meta: { page: number; per_page: number; total: number };
  selected: Meal | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: MealsState = {
  items: [],
  meta: { page: 1, per_page: 20, total: 0 },
  selected: null,
  status: "idle",
  error: null,
};

type MealsResponse = { items: Meal[]; meta?: { page: number; per_page: number; total: number } };

export const fetchMeals = createAsyncThunk<MealsResponse, number | undefined>("meals/fetchAll", async (page = 1) => {
  const { data } = await api.get<MealsResponse>("/meals", { params: { page, per_page: 20 } });
  return data;
});

export const fetchMealById = createAsyncThunk<Meal, string>("meals/fetchById", async (id) => {
  const { data } = await api.get<Meal>(`/meals/${id}`);
  return data;
});

export const createMeal = createAsyncThunk<Meal, FormData>("meals/create", async (payload) => {
  const { data } = await api.post<Meal>("/meals", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
});

export const updateMeal = createAsyncThunk<Meal, { id: string; payload: Partial<MealPayload> }>(
  "meals/update",
  async ({ id, payload }) => {
    const { data } = await api.patch<Meal>(`/meals/${id}`, payload);
    return data;
  },
);

export const deleteMeal = createAsyncThunk<string, string>("meals/delete", async (id) => {
  await api.delete(`/meals/${id}`);
  return id;
});

const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMeals.fulfilled, (state, action: PayloadAction<MealsResponse>) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.meta = action.payload.meta ?? state.meta;
      })
      .addCase(fetchMeals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch meals";
      })
      .addCase(fetchMealById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createMeal.fulfilled, (state, action) => {
        const meal = action.payload as Meal;
        if (meal?.id) {
          state.items = [meal, ...state.items];
        }
      })
      .addCase(updateMeal.fulfilled, (state, action) => {
        state.items = state.items.map((m) => (m.id === action.payload.id ? action.payload : m));
        state.selected = action.payload;
      })
      .addCase(deleteMeal.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
      });
  },
});

export const selectMeals = (state: RootState) => state.meals;
export default mealsSlice.reducer;
