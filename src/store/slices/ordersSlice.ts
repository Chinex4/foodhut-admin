import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import type { Order } from "@/types/order";
import type { RootState } from "..";

type OrdersState = {
  items: Order[];
  meta: { page: number; per_page: number; total: number };
  selected: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: OrdersState = {
  items: [],
  meta: { page: 1, per_page: 20, total: 0 },
  selected: null,
  status: "idle",
  error: null,
};

type OrdersResponse = { items: Order[]; meta?: { page: number; per_page: number; total: number } };

export const fetchOrders = createAsyncThunk<OrdersResponse, number | undefined>("orders/fetchAll", async (page = 1) => {
  const { data } = await api.get<OrdersResponse>("/orders", { params: { page, per_page: 20 } });
  return data;
});

export const updateOrderStatus = createAsyncThunk<Order, { id: string; status: string }>(
  "orders/updateStatus",
  async ({ id, status }) => {
    const { data } = await api.put<Order>(`/orders/${id}/status`, { status });
    return data;
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    select(state, action: PayloadAction<Order | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OrdersResponse>) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.meta = action.payload.meta ?? state.meta;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.items = state.items.map((order) => (order.id === action.payload.id ? action.payload : order));
        state.selected = action.payload;
      });
  },
});

export const selectOrders = (state: RootState) => state.orders;
export const { select } = ordersSlice.actions;
export default ordersSlice.reducer;
