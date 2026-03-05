import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "..";
import type {
  ComplianceItem,
  LogisticsBusinessAccount,
  LogisticsSignupPayload,
  LogisticsOrder,
  RegisterRiderPayload,
  RiderAccount,
  RiderStatus,
  WalletEntry,
} from "@/types/logistics";

type LogisticsState = {
  businessAccount: LogisticsBusinessAccount | null;
  complianceChecklist: ComplianceItem[];
  riders: RiderAccount[];
  orders: LogisticsOrder[];
  walletEntries: WalletEntry[];
};

const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 6)}${Date.now().toString().slice(-4)}`;

const initialState: LogisticsState = {
  businessAccount: {
    id: "lg-2110",
    companyName: "SwiftDrop Logistics Ltd",
    registrationNumber: "RC-8841202",
    contactEmail: "ops@swiftdrop.ng",
    contactPhone: "+2348063321109",
    city: "Lagos",
    fleetSize: 18,
    status: "approved",
    createdAt: "2026-01-18T08:45:00.000Z",
  },
  complianceChecklist: [
    { id: "c-01", label: "CAC Certificate", status: "approved", updatedAt: "2026-02-10T10:00:00.000Z" },
    { id: "c-02", label: "TIN / Tax Record", status: "pending", updatedAt: "2026-02-12T13:40:00.000Z" },
    { id: "c-03", label: "Insurance Cover", status: "approved", updatedAt: "2026-02-11T09:20:00.000Z" },
    { id: "c-04", label: "Operations Manager ID", status: "missing", updatedAt: "2026-02-09T07:10:00.000Z" },
  ],
  riders: [
    {
      id: "lr-410",
      fullName: "Michael Chukwu",
      phoneNumber: "+2348090021101",
      bikeType: "Bike",
      plateNumber: "LSD-901AJ",
      bikeAccountId: "BIKE-1021",
      passcodeUpdatedAt: "2026-02-19T12:33:00.000Z",
      activeOrders: 2,
      earningsToday: 11800,
      status: "active",
    },
    {
      id: "lr-411",
      fullName: "Sadiya Musa",
      phoneNumber: "+2348090021102",
      bikeType: "Scooter",
      plateNumber: "LND-420SP",
      bikeAccountId: "BIKE-1022",
      passcodeUpdatedAt: "2026-02-24T16:50:00.000Z",
      activeOrders: 1,
      earningsToday: 8600,
      status: "active",
    },
    {
      id: "lr-412",
      fullName: "Kenechukwu Obi",
      phoneNumber: "+2348090021103",
      bikeType: "Bike",
      plateNumber: "LSD-711QW",
      bikeAccountId: "BIKE-1023",
      passcodeUpdatedAt: "2026-02-17T07:14:00.000Z",
      activeOrders: 0,
      earningsToday: 0,
      status: "paused",
    },
  ],
  orders: [
    {
      id: "ord-lg-01",
      riderId: "lr-410",
      riderName: "Michael Chukwu",
      pickup: "Mainland Grill House, Lekki",
      dropoff: "Admiralty Way, Lekki Phase 1",
      amount: 5600,
      status: "delivering",
      createdAt: "2026-03-04T09:12:00.000Z",
    },
    {
      id: "ord-lg-02",
      riderId: "lr-410",
      riderName: "Michael Chukwu",
      pickup: "Eko Salad Studio, Ikeja",
      dropoff: "Sabo, Yaba",
      amount: 4700,
      status: "picked_up",
      createdAt: "2026-03-04T09:42:00.000Z",
    },
    {
      id: "ord-lg-03",
      riderId: "lr-411",
      riderName: "Sadiya Musa",
      pickup: "Korede Foods, Victoria Island",
      dropoff: "Oniru Estate, VI",
      amount: 6900,
      status: "assigned",
      createdAt: "2026-03-04T10:01:00.000Z",
    },
    {
      id: "ord-lg-04",
      riderId: "lr-412",
      riderName: "Kenechukwu Obi",
      pickup: "Abuja Pasta Lab, Wuse 2",
      dropoff: "Jabi District",
      amount: 0,
      status: "paused",
      createdAt: "2026-03-04T10:15:00.000Z",
    },
  ],
  walletEntries: [
    { id: "wal-01", label: "Order payout batch", amount: 22000, type: "credit", createdAt: "2026-03-04T08:30:00.000Z" },
    { id: "wal-02", label: "Fuel allowance transfer", amount: 6000, type: "debit", createdAt: "2026-03-04T07:12:00.000Z" },
    { id: "wal-03", label: "Settlement from Foodhut", amount: 38500, type: "credit", createdAt: "2026-03-03T18:09:00.000Z" },
    { id: "wal-04", label: "Rider emergency support", amount: 4000, type: "debit", createdAt: "2026-03-03T16:41:00.000Z" },
  ],
};

const logisticsSlice = createSlice({
  name: "logistics",
  initialState,
  reducers: {
    createBusinessAccount(state, action: PayloadAction<LogisticsSignupPayload>) {
      state.businessAccount = {
        id: makeId("lg"),
        ...action.payload,
        fleetSize: Math.max(action.payload.fleetSize, 1),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      state.complianceChecklist = state.complianceChecklist.map((item) =>
        item.status === "approved" ? item : { ...item, status: "pending", updatedAt: new Date().toISOString() },
      );
    },
    submitComplianceKyc(state) {
      const now = new Date().toISOString();
      state.complianceChecklist = state.complianceChecklist.map((item) => ({
        ...item,
        status: item.status === "approved" ? "approved" : "pending",
        updatedAt: now,
      }));
      if (state.businessAccount) {
        state.businessAccount = { ...state.businessAccount, status: "pending" };
      }
    },
    registerRiderBikeAccount(state, action: PayloadAction<RegisterRiderPayload>) {
      state.riders = [
        {
          id: makeId("lr"),
          fullName: action.payload.fullName.trim(),
          phoneNumber: action.payload.phoneNumber.trim(),
          bikeType: action.payload.bikeType.trim(),
          plateNumber: action.payload.plateNumber.trim().toUpperCase(),
          bikeAccountId: `BIKE-${Math.floor(1000 + Math.random() * 8999)}`,
          passcodeUpdatedAt: new Date().toISOString(),
          activeOrders: 0,
          earningsToday: 0,
          status: "active",
        },
        ...state.riders,
      ];
    },
    toggleRiderStatus(state, action: PayloadAction<{ riderId: string; active: boolean }>) {
      const nextStatus: RiderStatus = action.payload.active ? "active" : "paused";
      state.riders = state.riders.map((rider) =>
        rider.id === action.payload.riderId
          ? {
              ...rider,
              status: nextStatus,
              activeOrders: nextStatus === "paused" ? 0 : rider.activeOrders,
            }
          : rider,
      );
      state.orders = state.orders.map((order) =>
        order.riderId === action.payload.riderId && order.status !== "delivered"
          ? {
              ...order,
              status: nextStatus === "paused" ? "paused" : order.status === "paused" ? "assigned" : order.status,
            }
          : order,
      );
    },
    resetRiderPasscode(state, action: PayloadAction<string>) {
      state.riders = state.riders.map((rider) =>
        rider.id === action.payload
          ? {
              ...rider,
              passcodeUpdatedAt: new Date().toISOString(),
            }
          : rider,
      );
    },
  },
});

export const selectLogistics = (state: RootState) => state.logistics;
export const {
  createBusinessAccount,
  submitComplianceKyc,
  registerRiderBikeAccount,
  toggleRiderStatus,
  resetRiderPasscode,
} = logisticsSlice.actions;
export default logisticsSlice.reducer;
