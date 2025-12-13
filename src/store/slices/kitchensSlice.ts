import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
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
  const currentPage = page ?? 1;
  const { data } = await api.get<KitchensResponse>("/kitchens", { params: { page: currentPage, per_page: 20 } });
  if (Array.isArray((data as KitchensResponse).items)) {
    return { items: data.items, meta: data.meta ?? { page: currentPage, per_page: 20, total: data.items.length } };
  }
  const fallbackItems = Array.isArray(data) ? (data as unknown as Kitchen[]) : [];
  return { items: fallbackItems, meta: { page: currentPage, per_page: 20, total: fallbackItems.length } };
});

export const fetchKitchenTypes = createAsyncThunk<string[]>("kitchens/fetchTypes", async () => {
  const { data } = await api.get<string[]>("/kitchens/types");
  return data;
});

export const fetchKitchenCities = createAsyncThunk<string[]>("kitchens/fetchCities", async () => {
  const { data } = await api.get<string[]>("/kitchens/cities");
  return data;
});

export const fetchKitchenById = createAsyncThunk<Kitchen, string>("kitchens/fetchById", async (id) => {
  const { data } = await api.get<Kitchen>(`/kitchens/${id}`);
  return data;
});

export const updateKitchenById = createAsyncThunk<Kitchen, { id: string; payload: KitchenUpdatePayload }>(
  "kitchens/updateById",
  async ({ id, payload }) => {
    const { data } = await api.put<Kitchen>(`/kitchens/${id}`, payload);
    return data;
  },
);

export const updateKitchenCover = createAsyncThunk<Kitchen, { id: string; cover_image_url: string }>(
  "kitchens/updateCover",
  async ({ id, cover_image_url }) => {
    const { data } = await api.patch<Kitchen>(`/kitchens/${id}/cover`, { cover_image_url });
    return data;
  },
);

export const blockKitchen = createAsyncThunk<Kitchen, { id: string; blocked: boolean }>(
  "kitchens/block",
  async ({ id, blocked }) => {
    const { data } = await api.post<Kitchen>(`/kitchens/${id}/${blocked ? "block" : "unblock"}`);
    return data;
  },
);

export const verifyKitchen = createAsyncThunk<Kitchen, { id: string; verified: boolean }>(
  "kitchens/verify",
  async ({ id, verified }) => {
    const { data } = await api.post<Kitchen>(`/kitchens/${id}/${verified ? "verify" : "unverify"}`);
    return data;
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
