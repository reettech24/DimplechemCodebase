import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gmailAccessToken: localStorage.getItem('gmailAccessToken') || null,
  gmailisAuthenticated: localStorage.getItem('gmailisAuthenticated') === 'true',
  gmailtokenExpiry: localStorage.getItem("gmailtokenExpiry") || null, // store expiry
};

const googleGmailAuthSlice = createSlice({
  name: 'googleGmailAuth',
  initialState,
  reducers: {
    setgmailAccessToken: (state, action) => {
      state.gmailAccessToken = action.payload.token;
      state.gmailtokenExpiry = action.payload.expiry;
      localStorage.setItem('gmailAccessToken', action.payload.token);
      localStorage.setItem('gmailtokenExpiry', action.payload.expiry);
    },
    setgmailisAuthenticated: (state, action) => {
      state.gmailisAuthenticated = action.payload;
      localStorage.setItem('gmailisAuthenticated', action.payload.toString());
    },
    clearGmailAuth: (state) => {
      state.gmailAccessToken = null;
      state.gmailisAuthenticated = false;
      state.gmailtokenExpiry = null;
      localStorage.removeItem('gmailAccessToken');
      localStorage.removeItem('gmailisAuthenticated');
      localStorage.removeItem('gmailtokenExpiry');
    },
  },
});

export const { setgmailAccessToken, setgmailisAuthenticated, clearGmailAuth } = googleGmailAuthSlice.actions;
export default googleGmailAuthSlice.reducer;
