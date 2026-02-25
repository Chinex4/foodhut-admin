import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockRidersDb } from "@/data/mockDb";
import type { Rider, RiderKycStatus } from "@/types/rider";
import type { RootState } from "..";

type RidersState = {
  items: Rider[];
  selected: Rider | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: RidersState = {
  items: [],
  selected: null,
  status: "idle",
  error: null,
};

export const fetchRiders = createAsyncThunk<Rider[]>("riders/fetchAll", async () => {
  return mockRidersDb.fetchAll();
});

export const fetchRiderById = createAsyncThunk<Rider, string>("riders/fetchById", async (id) => {
  return mockRidersDb.fetchById(id);
});

export const reviewRiderKyc = createAsyncThunk<Rider, { id: string; kyc_status: RiderKycStatus }>(
  "riders/reviewKyc",
  async ({ id, kyc_status }) => {
    return mockRidersDb.setKycStatus(id, kyc_status);
  },
);

const ridersSlice = createSlice({
  name: "riders",
  initialState,
  reducers: {
    selectRider(state, action: PayloadAction<Rider | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRiders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRiders.fulfilled, (state, action: PayloadAction<Rider[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchRiders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch riders";
      })
      .addCase(fetchRiderById.fulfilled, (state, action: PayloadAction<Rider>) => {
        state.selected = action.payload;
      })
      .addCase(reviewRiderKyc.fulfilled, (state, action: PayloadAction<Rider>) => {
        state.selected = action.payload;
        state.items = state.items.map((rider) => (rider.id === action.payload.id ? action.payload : rider));
      });
  },
});

export const { selectRider } = ridersSlice.actions;
export const selectRiders = (state: RootState) => state.riders;
export default ridersSlice.reducer;
