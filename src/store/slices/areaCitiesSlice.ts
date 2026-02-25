import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockAreaCitiesDb } from "@/data/mockDb";
import type { AreaCity, AreaCityPayload } from "@/types/areaCity";
import type { RootState } from "..";

type AreaCitiesState = {
  items: AreaCity[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AreaCitiesState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchAreaCities = createAsyncThunk<AreaCity[]>("areaCities/fetchAll", async () => {
  return mockAreaCitiesDb.fetchAll();
});

export const createAreaCity = createAsyncThunk<AreaCity, AreaCityPayload>(
  "areaCities/create",
  async (payload) => {
    return mockAreaCitiesDb.create(payload);
  },
);

export const toggleAreaCityActive = createAsyncThunk<AreaCity, { id: string; is_active: boolean }>(
  "areaCities/toggleActive",
  async ({ id, is_active }) => {
    return mockAreaCitiesDb.setActive(id, is_active);
  },
);

const areaCitiesSlice = createSlice({
  name: "areaCities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreaCities.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAreaCities.fulfilled, (state, action: PayloadAction<AreaCity[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAreaCities.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch areas/cities";
      })
      .addCase(createAreaCity.fulfilled, (state, action: PayloadAction<AreaCity>) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(toggleAreaCityActive.fulfilled, (state, action: PayloadAction<AreaCity>) => {
        state.items = state.items.map((record) => (record.id === action.payload.id ? action.payload : record));
      });
  },
});

export const selectAreaCities = (state: RootState) => state.areaCities;
export default areaCitiesSlice.reducer;
