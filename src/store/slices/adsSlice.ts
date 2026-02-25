import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockAdsDb } from "@/data/mockDb";
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
  return mockAdsDb.fetchAll();
});

export const fetchAdById = createAsyncThunk<Ad, string>("ads/fetchById", async (id) => {
  return mockAdsDb.fetchById(id);
});

export const createAd = createAsyncThunk<Ad, AdPayload>("ads/create", async (payload) => {
  return mockAdsDb.create(payload);
});

export const updateAd = createAsyncThunk<Ad, { id: string; payload: Partial<AdPayload> }>(
  "ads/update",
  async ({ id, payload }) => {
    return mockAdsDb.update(id, payload);
  },
);

export const deleteAd = createAsyncThunk<string, string>("ads/delete", async (id) => {
  return mockAdsDb.deleteById(id);
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
