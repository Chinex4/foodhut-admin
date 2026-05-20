import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import type { RootState } from "..";
import type {
  ComplianceItem,
  LogisticsBusinessAccount,
  LogisticsCompany,
  LogisticsDelivery,
  LogisticsOffer,
  LogisticsOrder,
  LogisticsSignupPayload,
  RegisterRiderPayload,
  RiderAccount,
  RiderStatus,
  WalletEntry,
} from "@/types/logistics";

type ApiError = { response?: { data?: { message?: string; error?: string } }; message?: string };
type Meta = { page: number; per_page: number; total: number };
type ListResponse<T> = { items: T[]; meta?: Meta };

type LogisticsState = {
  businessAccount: LogisticsBusinessAccount | null;
  companies: LogisticsCompany[];
  deliveries: LogisticsDelivery[];
  offers: LogisticsOffer[];
  complianceChecklist: ComplianceItem[];
  riders: RiderAccount[];
  orders: LogisticsOrder[];
  walletEntries: WalletEntry[];
  meta: {
    companies: Meta;
    riders: Meta;
    deliveries: Meta;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  mutationStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const emptyMeta = { page: 1, per_page: 20, total: 0 };

const initialState: LogisticsState = {
  businessAccount: null,
  companies: [],
  deliveries: [],
  offers: [],
  complianceChecklist: [
    { id: "cac_certificate_id", label: "CAC Certificate", status: "missing", updatedAt: new Date().toISOString() },
    { id: "tin_tax_record_id", label: "TIN / Tax Record", status: "missing", updatedAt: new Date().toISOString() },
    { id: "insurance_cover_id", label: "Insurance Cover", status: "missing", updatedAt: new Date().toISOString() },
  ],
  riders: [],
  orders: [],
  walletEntries: [],
  meta: {
    companies: emptyMeta,
    riders: emptyMeta,
    deliveries: emptyMeta,
  },
  status: "idle",
  mutationStatus: "idle",
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as ApiError;
  return err.response?.data?.message || err.response?.data?.error || err.message || fallback;
};

const toIso = (value?: number | string | null) => {
  if (!value) return new Date().toISOString();
  if (typeof value === "number") return new Date(value * 1000).toISOString();
  return value;
};

const riderName = (rider: any) => {
  const first = rider.user?.first_name ?? rider.first_name ?? "";
  const last = rider.user?.last_name ?? rider.last_name ?? "";
  return `${first} ${last}`.trim() || rider.user?.email || rider.id;
};

const mapCompany = (company: any): LogisticsBusinessAccount => ({
  id: company.id,
  companyName: company.name,
  registrationNumber: company.registration_number,
  contactEmail: company.email,
  contactPhone: company.phone_number,
  city: typeof company.address === "string" ? company.address : company.address?.city ?? "—",
  fleetSize: 0,
  status: company.verification_status === "VERIFIED" ? "approved" : "pending",
  createdAt: toIso(company.created_at),
  raw: company,
});

const mapRider = (rider: any): RiderAccount => ({
  id: rider.id,
  fullName: riderName(rider),
  phoneNumber: rider.user?.phone_number ?? rider.phone_number ?? "—",
  email: rider.user?.email ?? rider.email,
  bikeType: rider.kyc?.vehicle_type ?? "—",
  plateNumber: rider.kyc?.vehicle_registration_number ?? "—",
  bikeAccountId: rider.id,
  passcodeUpdatedAt: toIso(rider.updated_at ?? rider.created_at),
  activeOrders: 0,
  earningsToday: 0,
  status: rider.is_blocked ? "blocked" : rider.is_available ? "active" : "paused",
  kycId: rider.kyc?.id,
  kycStatus:
    rider.kyc?.verification_status === "VERIFIED"
      ? "approved"
      : rider.kyc?.verification_status === "REJECTED"
        ? "rejected"
        : "pending",
  raw: rider,
});

const mapDeliveryToOrder = (delivery: LogisticsDelivery): LogisticsOrder => ({
  id: delivery.order_id ?? delivery.id,
  deliveryId: delivery.id,
  riderId: delivery.rider_id ?? "—",
  riderName: delivery.rider ? riderName(delivery.rider) : delivery.rider_id ?? "Unassigned",
  pickup:
    String(delivery.pickup_address ?? delivery.order?.kitchen?.address ?? delivery.order?.pickup_location ?? "—"),
  dropoff:
    String(delivery.dropoff_address ?? delivery.order?.delivery_address ?? delivery.order?.dropoff_location ?? "—"),
  amount: Number(delivery.delivery_fee ?? delivery.order?.delivery_fee ?? 0),
  status: delivery.delivery_status,
  createdAt: toIso(delivery.created_at),
});

export const createBusinessAccount = createAsyncThunk<LogisticsBusinessAccount, LogisticsSignupPayload>(
  "logistics/createBusinessAccount",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/logistics/companies", {
        name: payload.companyName,
        registration_number: payload.registrationNumber,
        email: payload.contactEmail,
        phone_number: payload.contactPhone,
        address: { city: payload.city, fleet_size: payload.fleetSize },
      });
      return mapCompany(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to create logistics account"));
    }
  },
);

export const fetchLogisticsCompanies = createAsyncThunk<ListResponse<LogisticsCompany>, number | undefined>(
  "logistics/fetchCompanies",
  async (page = 1, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ListResponse<LogisticsCompany>>("/logistics/companies", {
        params: { page, per_page: 20 },
      });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch logistics companies"));
    }
  },
);

export const submitComplianceKyc = createAsyncThunk<
  unknown,
  { company_id: string; cac_certificate_id: string; tin_tax_record_id: string; insurance_cover_id: string }
>("logistics/submitCompanyKyc", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/logistics/companies/kyc", payload);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to submit company KYC"));
  }
});

export const verifyCompanyKyc = createAsyncThunk<unknown, { kyc_id: string; verification_status: "VERIFIED" | "REJECTED" }>(
  "logistics/verifyCompanyKyc",
  async ({ kyc_id, verification_status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/logistics/companies/kyc/${kyc_id}/verify`, { verification_status });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to verify company KYC"));
    }
  },
);

export const fetchLogisticsRiders = createAsyncThunk<ListResponse<any>, number | undefined>(
  "logistics/fetchRiders",
  async (page = 1, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ListResponse<any>>("/logistics/riders", { params: { page, per_page: 50 } });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch riders"));
    }
  },
);

export const registerRiderBikeAccount = createAsyncThunk<RiderAccount, RegisterRiderPayload>(
  "logistics/registerRider",
  async (payload, { rejectWithValue }) => {
    try {
      const [first_name, ...rest] = payload.fullName.trim().split(/\s+/);
      const { data } = await api.post("/logistics/riders", {
        first_name,
        last_name: rest.join(" ") || first_name,
        email: payload.email,
        phone_number: payload.phoneNumber,
      });
      return mapRider(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to register rider"));
    }
  },
);

export const toggleRiderStatus = createAsyncThunk<
  RiderAccount,
  { riderId: string; active: boolean; blocked?: boolean },
  { state: RootState }
>("logistics/toggleRiderStatus", async ({ riderId, active, blocked }, { getState, rejectWithValue }) => {
  try {
    const rider = getState().logistics.riders.find((item) => item.id === riderId);
    const { data } = await api.patch(`/logistics/riders/${riderId}/status`, {
      is_available: active,
      is_blocked: blocked ?? rider?.status === "blocked",
    });
    return mapRider(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to update rider status"));
  }
});

export const verifyRiderKyc = createAsyncThunk<RiderAccount, { riderId: string; kyc_id: string; verification_status: "VERIFIED" | "REJECTED" }>(
  "logistics/verifyRiderKyc",
  async ({ riderId, kyc_id, verification_status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/logistics/riders/kyc/${kyc_id}/verify`, { verification_status });
      return mapRider({ id: riderId, kyc: data, is_available: false, is_blocked: false });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to verify rider KYC"));
    }
  },
);

export const fetchDeliveries = createAsyncThunk<ListResponse<LogisticsDelivery>, number | undefined>(
  "logistics/fetchDeliveries",
  async (page = 1, { rejectWithValue }) => {
    try {
      const { data } = await api.get<ListResponse<LogisticsDelivery>>("/logistics/deliveries", {
        params: { page, per_page: 50 },
      });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch deliveries"));
    }
  },
);

export const updateDeliveryStatus = createAsyncThunk<LogisticsDelivery, { delivery_id: string; delivery_status: string }>(
  "logistics/updateDeliveryStatus",
  async ({ delivery_id, delivery_status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/logistics/deliveries/${delivery_id}/status`, { delivery_status });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to update delivery status"));
    }
  },
);

export const fetchDeliveryOffers = createAsyncThunk<LogisticsOffer[], string>(
  "logistics/fetchDeliveryOffers",
  async (order_id, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ data: LogisticsOffer[] }>(`/logistics/orders/${order_id}/offers`);
      return data.data ?? [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch delivery offers"));
    }
  },
);

export const counterDeliveryOffer = createAsyncThunk<LogisticsOffer, { offer_id: string; amount: number }>(
  "logistics/counterOffer",
  async ({ offer_id, amount }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/logistics/offers/${offer_id}/counter`, { amount });
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to counter offer"));
    }
  },
);

export const acceptDeliveryOffer = createAsyncThunk<LogisticsOffer, string>("logistics/acceptOffer", async (offer_id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/logistics/offers/${offer_id}/accept`);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to accept offer"));
  }
});

export const rejectDeliveryOffer = createAsyncThunk<LogisticsOffer, string>("logistics/rejectOffer", async (offer_id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/logistics/offers/${offer_id}/reject`);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to reject offer"));
  }
});

const logisticsSlice = createSlice({
  name: "logistics",
  initialState,
  reducers: {
    resetRiderPasscode(state, action: PayloadAction<string>) {
      state.riders = state.riders.map((rider) =>
        rider.id === action.payload ? { ...rider, passcodeUpdatedAt: new Date().toISOString() } : rider,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBusinessAccount.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.businessAccount = action.payload;
        state.companies = [action.payload.raw as LogisticsCompany, ...state.companies];
      })
      .addCase(fetchLogisticsCompanies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.companies = action.payload.items ?? [];
        state.meta.companies = action.payload.meta ?? state.meta.companies;
        state.businessAccount = action.payload.items?.[0] ? mapCompany(action.payload.items[0]) : state.businessAccount;
      })
      .addCase(submitComplianceKyc.fulfilled, (state) => {
        const now = new Date().toISOString();
        state.mutationStatus = "succeeded";
        state.complianceChecklist = state.complianceChecklist.map((item) => ({ ...item, status: "pending", updatedAt: now }));
        if (state.businessAccount) state.businessAccount.status = "pending";
      })
      .addCase(fetchLogisticsRiders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.riders = (action.payload.items ?? []).map(mapRider);
        state.meta.riders = action.payload.meta ?? state.meta.riders;
      })
      .addCase(registerRiderBikeAccount.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.riders = [action.payload, ...state.riders.filter((rider) => rider.id !== action.payload.id)];
      })
      .addCase(toggleRiderStatus.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.riders = state.riders.map((rider) => (rider.id === action.payload.id ? { ...rider, ...action.payload } : rider));
      })
      .addCase(verifyRiderKyc.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.riders = state.riders.map((rider) =>
          rider.id === action.payload.id ? { ...rider, kycStatus: action.payload.kycStatus } : rider,
        );
      })
      .addCase(fetchDeliveries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deliveries = action.payload.items ?? [];
        state.orders = state.deliveries.map(mapDeliveryToOrder);
        state.meta.deliveries = action.payload.meta ?? state.meta.deliveries;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.deliveries = state.deliveries.map((delivery) => (delivery.id === action.payload.id ? action.payload : delivery));
        state.orders = state.deliveries.map(mapDeliveryToOrder);
      })
      .addCase(fetchDeliveryOffers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.offers = action.payload;
      })
      .addMatcher(
        isAnyOf(counterDeliveryOffer.fulfilled, acceptDeliveryOffer.fulfilled, rejectDeliveryOffer.fulfilled),
        (state, action) => {
          state.mutationStatus = "succeeded";
          state.offers = state.offers.map((offer) => (offer.id === action.payload.id ? action.payload : offer));
        },
      )
      .addMatcher(
        (action) => action.type.startsWith("logistics/") && action.type.endsWith("/pending"),
        (state, action) => {
          if (String(action.type).includes("fetch")) state.status = "loading";
          else state.mutationStatus = "loading";
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith("logistics/") && action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.status = "failed";
          state.mutationStatus = "failed";
          state.error = action.payload || action.error?.message || "Logistics request failed";
        },
      );
  },
});

export const selectLogistics = (state: RootState) => state.logistics;
export const { resetRiderPasscode } = logisticsSlice.actions;
export default logisticsSlice.reducer;
