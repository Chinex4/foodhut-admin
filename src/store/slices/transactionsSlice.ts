import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import type { Transaction } from "@/types/transaction";
import type { RootState } from "..";

type TransactionsState = {
  items: Transaction[];
  selected: Transaction | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: TransactionsState = {
  items: [],
  selected: null,
  status: "idle",
  error: null,
};

type TransactionsResponse = { items: Transaction[]; meta?: unknown };

export const fetchTransactions = createAsyncThunk<Transaction[]>("transactions/fetchAll", async () => {
  const { data } = await api.get<TransactionsResponse>("/wallets/transactions", { params: { page: 1, per_page: 50 } });
  return data.items;
});

export const fetchTransactionById = createAsyncThunk<Transaction, string>(
  "transactions/fetchById",
  async (id) => {
    const { data } = await api.get<Transaction>(`/wallets/transactions/${id}`);
    return data;
  },
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch transactions";
      })
      .addCase(fetchTransactionById.fulfilled, (state, action) => {
        state.selected = action.payload;
      });
  },
});

export const selectTransactions = (state: RootState) => state.transactions;
export default transactionsSlice.reducer;
