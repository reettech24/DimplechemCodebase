import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

// ✅ LIST POA
export const listPOA = createAsyncThunk(
  "auth/getplanofaction",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    console.log("Fetching POA list...");
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/getplanofaction`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to list POA");
    }
  }
);

// ✅ ADD POA
export const addPOA = createAsyncThunk(
  "auth/create-planofaction",
  async (poaData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_URL}/auth/create-planofaction`, poaData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add POA");
    }
  }
);

// ✅ UPDATE POA
export const updatePOA = createAsyncThunk(
    "auth/update-planofaction",
    async ({ id, sales_persion_id }, { rejectWithValue }) => {
      try {
        const token = getAuthToken();
        const response = await axios.put(
          `${API_URL}/auth/update-planofaction/${id}`,
          { sales_persion_id }, // send only the field to update
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || "Failed to update POA"
        );
      }
    }
  );
  

// ✅ REPORT BY POA ID
// export const reportByPoaId = createAsyncThunk(
//   "poa/reportById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const token = getAuthToken();
//       const response = await axios.get(`${API_URL}/poa/report/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to fetch POA report");
//     }
//   }
// );

// ✅ FETCH ALL POA REPORT
export const fetchAllPoaReports = createAsyncThunk(
  "auth/getplanofactionData",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/getplanofaction`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { all: true },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch all POA reports");
    }
  }
);

const poaSlice = createSlice({
  name: "poa",
  initialState: {
    poaList: [],
    allPoaReports: [],
    poaLoading: false,
    poaError: null,
    totalPages: 1, // ← ADD THIS
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(listPOA.pending, (state) => {
      state.poaLoading = true;
      state.poaError = null;
    })
    .addCase(listPOA.fulfilled, (state, action) => {
      state.poaLoading = false;
      state.poaList = action.payload;
      state.totalPages = action.payload.totalPages || 1;
    })
    .addCase(listPOA.rejected, (state, action) => {
      state.poaLoading = false;
      state.poaError = action.payload;
    })
    

      .addCase(addPOA.fulfilled, (state, action) => {
        state.poaList.data = [action.payload.data, ...state.poaList.data];
      })
      .addCase(addPOA.rejected, (state, action) => {
        state.poaError = action.payload;
      })

      .addCase(updatePOA.fulfilled, (state, action) => {
        const index = state.poaList.data?.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.poaList.data[index] = action.payload;
        }
      })
      .addCase(updatePOA.rejected, (state, action) => {
        state.poaError = action.payload;
      })
      .addCase(fetchAllPoaReports.fulfilled, (state, action) => {
        state.allPoaReports = action.payload;
      })
      .addCase(fetchAllPoaReports.rejected, (state, action) => {
        state.poaError = action.payload;
      });
  },
});

export default poaSlice.reducer;
