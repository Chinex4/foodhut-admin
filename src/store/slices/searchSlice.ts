import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import type { SearchResults } from "@/types/search";
import type { RootState } from "..";

type SearchState = {
  results: SearchResults;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: SearchState = {
  results: { items: [], meals: [], kitchens: [], meta: { page: 1, per_page: 10, total: 0 } },
  status: "idle",
  error: null,
};

export const searchAll = createAsyncThunk<SearchResults, { term: string; page?: number }>(
  "search/query",
  async ({ term, page = 1 }) => {
    const { data } = await api.get<SearchResults>("/search", { params: { search: term, page } });
    if (Array.isArray((data as SearchResults).items)) {
      return data;
    }
    const items = Array.isArray(data?.items) ? data.items : [];
    return { items, meals: data?.meals, kitchens: data?.kitchens, meta: data?.meta };
  },
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearResults(state) {
      state.results = { items: [], meals: [], kitchens: [], meta: { page: 1, per_page: 10, total: 0 } };
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAll.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchAll.fulfilled, (state, action: PayloadAction<SearchResults>) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(searchAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Search failed";
      });
  },
});

export const { clearResults } = searchSlice.actions;
export const selectSearch = (state: RootState) => state.search;
export default searchSlice.reducer;
