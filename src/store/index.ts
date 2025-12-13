import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import kitchensReducer from "./slices/kitchensSlice";
import mealsReducer from "./slices/mealsSlice";
import adsReducer from "./slices/adsSlice";
import ordersReducer from "./slices/ordersSlice";
import transactionsReducer from "./slices/transactionsSlice";
import searchReducer from "./slices/searchSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kitchens: kitchensReducer,
    meals: mealsReducer,
    ads: adsReducer,
    orders: ordersReducer,
    transactions: transactionsReducer,
    search: searchReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
