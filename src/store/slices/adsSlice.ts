import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import type { Ad, AdPayload } from "@/types/ad";
import type { RootState } from "..";

type AdsState = {
  items: Ad[];
  selected: Ad | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AdsState = {
  items: [],
  selected: null,
  status: "idle",
  error: null,
};

type AdsResponse = { items: Ad[]; meta?: unknown };

export const fetchAds = createAsyncThunk<Ad[]>("ads/fetchAll", async () => {
  const { data } = await api.get<AdsResponse>("/ads");
  if (Array.isArray((data as AdsResponse).items)) return data.items;
  return Array.isArray(data) ? (data as unknown as Ad[]) : [];
});

export const fetchAdById = createAsyncThunk<Ad, string>("ads/fetchById", async (id) => {
  const { data } = await api.get<Ad>(`/ads/${id}`);
  return data;
});

export const createAd = createAsyncThunk<Ad, AdPayload>("ads/create", async (payload) => {
  const { data } = await api.post<Ad>("/ads", payload);
  return data;
});

export const updateAd = createAsyncThunk<Ad, { id: string; payload: Partial<AdPayload> }>(
  "ads/update",
  async ({ id, payload }) => {
    const { data } = await api.put<Ad>(`/ads/${id}`, payload);
    return data;
  },
);

export const deleteAd = createAsyncThunk<string, string>("ads/delete", async (id) => {
  await api.delete(`/ads/${id}`);
  return id;
});

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAds.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAds.fulfilled, (state, action: PayloadAction<Ad[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch ads";
      })
      .addCase(fetchAdById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createAd.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateAd.fulfilled, (state, action) => {
        state.items = state.items.map((ad) => (ad.id === action.payload.id ? action.payload : ad));
        state.selected = action.payload;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.items = state.items.filter((ad) => ad.id !== action.payload);
      });
  },
});

export const selectAds = (state: RootState) => state.ads;
export default adsSlice.reducer;
