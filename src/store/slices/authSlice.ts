import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { api } from "@/api/axios";
import { tokenStorage } from "@/lib/tokenStorage";
import type { AuthTokens, OtpPayload, PortalType, UserProfile } from "@/types/auth";
import type { RootState } from "..";

type AuthState = {
  tokens: AuthTokens | null;
  profile: UserProfile | null;
  portal: PortalType | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AuthState = {
  tokens: tokenStorage.get(),
  portal: tokenStorage.getPortal(),
  profile: null,
  status: "idle",
  error: null,
};

export const sendOtp = createAsyncThunk<void, string>("auth/sendOtp", async (phone_number) => {
  await api.post("/auth/sign-in", { phone_number });
});

export const resendOtp = createAsyncThunk<void, string>("auth/resendOtp", async (phone_number) => {
  await api.post("/auth/sign-in", { phone_number });
});

export const verifyOtp = createAsyncThunk<AuthTokens, OtpPayload>(
  "auth/verifyOtp",
  async (payload) => {
    const { data } = await api.post<AuthTokens>("/auth/verify", payload);
    tokenStorage.set(data);
    return data;
  },
);

export const refreshTokens = createAsyncThunk<AuthTokens, string>(
  "auth/refreshTokens",
  async (token) => {
    const { data } = await api.post<AuthTokens>("/auth/refresh", { token });
    tokenStorage.set(data);
    return data;
  },
);

export const fetchProfile = createAsyncThunk<UserProfile>("auth/fetchProfile", async () => {
  const { data } = await api.get<UserProfile>("/users/profile");
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<AuthTokens | null>) {
      state.tokens = action.payload;
      if (action.payload) {
        tokenStorage.set(action.payload);
      } else {
        tokenStorage.clear();
      }
    },
    setPortal(state, action: PayloadAction<PortalType | null>) {
      state.portal = action.payload;
      if (action.payload) {
        tokenStorage.setPortal(action.payload);
      } else {
        tokenStorage.clearPortal();
      }
    },
    logout(state) {
      state.tokens = null;
      state.portal = null;
      state.profile = null;
      state.status = "idle";
      tokenStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to send OTP";
      })
      .addCase(resendOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to resend OTP";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.tokens = action.payload;
        state.status = "succeeded";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to verify OTP";
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.tokens = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const { logout, setTokens, setPortal } = authSlice.actions;
export default authSlice.reducer;
