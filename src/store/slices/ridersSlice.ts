import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
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

const mapRider = (rider: any): Rider => ({
  id: rider.id,
  full_name:
    `${rider.user?.first_name ?? rider.first_name ?? ""} ${rider.user?.last_name ?? rider.last_name ?? ""}`.trim() ||
    rider.user?.email ||
    rider.id,
  phone_number: rider.user?.phone_number ?? rider.phone_number ?? "—",
  email: rider.user?.email ?? rider.email,
  city: rider.logistics_company?.address?.city ?? "—",
  area: rider.logistics_company?.name ?? "—",
  vehicle_type: rider.kyc?.vehicle_type ?? "—",
  plate_number: rider.kyc?.vehicle_registration_number ?? "—",
  status: rider.is_blocked ? "blocked" : rider.is_available ? "active" : "offline",
  kyc_status:
    rider.kyc?.verification_status === "VERIFIED"
      ? "approved"
      : rider.kyc?.verification_status === "REJECTED"
        ? "rejected"
        : "pending",
  completed_orders: 0,
  rating: 0,
  current_location: "—",
  profile_image_url: rider.user?.profile_picture?.url,
  kyc_documents: rider.kyc?.id_document_id ? [rider.kyc.id_document_id] : [],
  created_at: typeof rider.created_at === "number" ? new Date(rider.created_at * 1000).toISOString() : rider.created_at,
});

export const fetchRiders = createAsyncThunk<Rider[]>("riders/fetchAll", async () => {
  const { data } = await api.get<{ items: any[] }>("/logistics/riders", { params: { page: 1, per_page: 50 } });
  return (data.items ?? []).map(mapRider);
});

export const fetchRiderById = createAsyncThunk<Rider, string>("riders/fetchById", async (id) => {
  const { data } = await api.get<{ items: any[] }>("/logistics/riders", { params: { page: 1, per_page: 50 } });
  const rider = (data.items ?? []).find((item) => item.id === id);
  if (!rider) throw new Error("Rider not found");
  return mapRider(rider);
});

export const reviewRiderKyc = createAsyncThunk<Rider, { id: string; kyc_status: RiderKycStatus }>(
  "riders/reviewKyc",
  async ({ id, kyc_status }) => {
    const { data } = await api.patch(`/logistics/riders/kyc/${id}/verify`, {
      verification_status: kyc_status === "approved" ? "VERIFIED" : "REJECTED",
    });
    return mapRider({ id, kyc: data, is_available: false, is_blocked: false });
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
