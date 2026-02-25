import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockKitchensDb } from "@/data/mockDb";
import type { Kitchen, KitchenUpdatePayload } from "@/types/kitchen";
import type { RootState } from "..";

type KitchensState = {
  items: Kitchen[];
  meta: { page: number; per_page: number; total: number };
  selected: Kitchen | null;
  types: string[];
  cities: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: KitchensState = {
  items: [],
  meta: { page: 1, per_page: 10, total: 0 },
  selected: null,
  types: [],
  cities: [],
  status: "idle",
  error: null,
};

type KitchensResponse = { items: Kitchen[]; meta?: { page: number; per_page: number; total: number } };

export const fetchKitchens = createAsyncThunk<KitchensResponse, number | undefined>("kitchens/fetchAll", async (page = 1) => {
  return mockKitchensDb.fetchAll(page ?? 1);
});

export const fetchKitchenTypes = createAsyncThunk<string[]>("kitchens/fetchTypes", async () => {
  return mockKitchensDb.fetchTypes();
});

export const fetchKitchenCities = createAsyncThunk<string[]>("kitchens/fetchCities", async () => {
  return mockKitchensDb.fetchCities();
});

export const fetchKitchenById = createAsyncThunk<Kitchen, string>("kitchens/fetchById", async (id) => {
  return mockKitchensDb.fetchById(id);
});

export const updateKitchenById = createAsyncThunk<Kitchen, { id: string; payload: KitchenUpdatePayload }>(
  "kitchens/updateById",
  async ({ id, payload }) => {
    return mockKitchensDb.updateById(id, payload);
  },
);

export const updateKitchenCover = createAsyncThunk<Kitchen, { id: string; cover_image_url: string }>(
  "kitchens/updateCover",
  async ({ id, cover_image_url }) => {
    return mockKitchensDb.updateCover(id, cover_image_url);
  },
);

export const blockKitchen = createAsyncThunk<Kitchen, { id: string; blocked: boolean }>(
  "kitchens/block",
  async ({ id, blocked }) => {
    return mockKitchensDb.setBlocked(id, blocked);
  },
);

export const verifyKitchen = createAsyncThunk<Kitchen, { id: string; verified: boolean }>(
  "kitchens/verify",
  async ({ id, verified }) => {
    return mockKitchensDb.setVerified(id, verified);
  },
);

const kitchensSlice = createSlice({
  name: "kitchens",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKitchens.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchKitchens.fulfilled, (state, action: PayloadAction<KitchensResponse>) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.meta = action.payload.meta ?? state.meta;
      })
      .addCase(fetchKitchens.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch kitchens";
      })
      .addCase(fetchKitchenTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      })
      .addCase(fetchKitchenCities.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      .addCase(fetchKitchenById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(updateKitchenById.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.items = state.items.map((k) => (k.id === action.payload.id ? action.payload : k));
      })
      .addCase(updateKitchenCover.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.items = state.items.map((k) => (k.id === action.payload.id ? action.payload : k));
      })
      .addCase(blockKitchen.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.items = state.items.map((k) => (k.id === action.payload.id ? action.payload : k));
      })
      .addCase(verifyKitchen.fulfilled, (state, action) => {
        state.selected = action.payload;
        state.items = state.items.map((k) => (k.id === action.payload.id ? action.payload : k));
      });
  },
});

export const selectKitchens = (state: RootState) => state.kitchens;
export default kitchensSlice.reducer;
