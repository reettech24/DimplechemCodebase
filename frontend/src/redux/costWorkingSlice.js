import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

// ✅ LIST COST WORKING ENTRIES
export const listCostWorkings = createAsyncThunk(
  "auth/getcostingwork",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    console.log("reduc fun");
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/getcostingwork`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch cost workings");
    }
  }
);

// ✅ FETCH ALL COST WORKINGS
export const fetchAllCostWorkings = createAsyncThunk(
  "costWorking/fetchAllCostWorkings",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/cost-working`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { all: true },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch all cost workings");
    }
  }
);

// ✅ ADD COST WORKING
export const addCostWorking = createAsyncThunk(
  "auth/addCostWorking",
  async (data, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_URL}/auth/addCostWorking`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add cost working");
    }
  }
);

// ✅ UPDATE COST WORKING
export const updateCostWorking = createAsyncThunk(
  "auth/cost-working/update",
  async ({ id, data }, { rejectWithValue }) => {
    console.log("check data",id, data );
    try {
      const token = getAuthToken();
      const response = await axios.put(`${API_URL}/auth/cost-working/update/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update cost working");
    }
  }
);

// ✅ DELETE COST WORKING
export const removeCostWorking = createAsyncThunk(
  "costWorking/removeCostWorking",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/cost-working/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete cost working");
    }
  }
);

// 🔹 COST WORKING SLICE
const costWorkingSlice = createSlice({
  name: "costWorking",
  initialState: {
    costWorkings: [],
    allCostWorkings: [],
    costWorkingLoading: false,
    costWorkingError: null,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCostWorkings.pending, (state) => {
        state.costWorkingLoading = true;
        state.costWorkingError = null;
      })
      .addCase(fetchAllCostWorkings.fulfilled, (state, action) => {
        state.costWorkingLoading = false;
        state.allCostWorkings = action.payload;
      })
      .addCase(fetchAllCostWorkings.rejected, (state, action) => {
        state.costWorkingLoading = false;
        state.costWorkingError = action.payload;
      })
      .addCase(listCostWorkings.pending, (state) => {
        state.costWorkingLoading = true;
        state.costWorkingError = null;
      })
      .addCase(listCostWorkings.fulfilled, (state, action) => {
        state.costWorkingLoading = false;
        state.costWorkings = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
        state.totalPages = action.payload.totalPages || 1;
      })
      
      .addCase(listCostWorkings.rejected, (state, action) => {
        state.costWorkingLoading = false;
        state.costWorkingError = action.payload;
      })
      .addCase(addCostWorking.pending, (state) => {
        state.costWorkingLoading = true;
        state.costWorkingError = null;
      })
      .addCase(addCostWorking.fulfilled, (state, action) => {
        state.costWorkingLoading = false;
        state.costWorkingError = null;
      
        // Make sure we’re working with an array
        const existing = Array.isArray(state.costWorkings) ? state.costWorkings : [];
      
        state.costWorkings = [action.payload.data, ...existing];
      })
      
      
      .addCase(addCostWorking.rejected, (state, action) => {
        state.costWorkingLoading = false;
        state.costWorkingError = action.payload;
      })
      .addCase(updateCostWorking.pending, (state) => {
        state.costWorkingLoading = true;
        state.costWorkingError = null;
      })
      .addCase(updateCostWorking.fulfilled, (state, action) => {
        state.costWorkingLoading = false;
        const index = state.costWorkings.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.costWorkings[index] = action.payload;
        }
      })
      .addCase(updateCostWorking.rejected, (state, action) => {
        state.costWorkingLoading = false;
        state.costWorkingError = action.payload;
      })
      .addCase(removeCostWorking.pending, (state) => {
        state.costWorkingLoading = true;
        state.costWorkingError = null;
      })
      .addCase(removeCostWorking.fulfilled, (state, action) => {
        state.costWorkingLoading = false;
        state.costWorkings = state.costWorkings.filter(
          (item) => item.id !== action.payload.id
        );
      })
      .addCase(removeCostWorking.rejected, (state, action) => {
        state.costWorkingLoading = false;
        state.costWorkingError = action.payload;
      });
  },
});

export default costWorkingSlice.reducer;
