import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  tokenExpiry: localStorage.getItem("tokenExpiry") || null, // store expiry
};

const googleCalenderAuthSlice = createSlice({
  name: "googleCalenderAuth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.token;
      state.tokenExpiry = action.payload.expiry;
      localStorage.setItem('accessToken', action.payload.token);
      localStorage.setItem('tokenExpiry', action.payload.expiry);
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      localStorage.setItem("isAuthenticated", action.payload.toString());
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem('tokenExpiry');
    },
  },
});

export const { setAccessToken, setIsAuthenticated, clearAuth } =
  googleCalenderAuthSlice.actions;
export default googleCalenderAuthSlice.reducer;
