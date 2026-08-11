import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

// ✅ LIST DEPARTMENTS
export const listDepartments = createAsyncThunk(
  "auth/departmentList",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/departmentList`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch departments"
      );
    }
  }
);

//fetch all departments
export const fetchAllDepartments = createAsyncThunk(
  "auth/fetchAllDepartments",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/departmentList`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { all: true }, // Fetch all departments
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all departments"
      );
    }
  }
);

// ✅ ADD DEPARTMENT
export const addDepartment = createAsyncThunk(
  "auth/departmentAdd",
  async (departmentData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_URL}/auth/departmentAdd`,
        departmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add department"
      );
    }
  }
);

// ✅ UPDATE DEPARTMENT
export const updateDepartment = createAsyncThunk(
  "auth/departmentUpdate",
  async ({ id, departmentData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_URL}/auth/departmentUpdate/${id}`,
        departmentData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update department"
      );
    }
  }
);

// ✅ DELETE DEPARTMENT
export const removeDepartment = createAsyncThunk(
  "auth/departmentRemove",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/auth/departmentRemove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete department"
      );
    }
  }
);

// 🔹 DEPARTMENT SLICE
const departmentSlice = createSlice({
  name: "department",
  initialState: {
    departments: [],
    allDepartments: [],
    departmentloading: false,
    departmenterror: null,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.allDepartments = action.payload;
      })
      .addCase(fetchAllDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(listDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(listDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        // ✅ Add new customer to existing state without re-fetching
        state.departments.data = [
          action.payload.data,
          ...state.departments.data,
        ];
      })
      // .addCase(addDepartment.fulfilled, (state, action) => {
      //   state.loading = false;
      //   if (Array.isArray(state.departments)) {
      //     state.departments.push(action.payload.data);
      //   } else {
      //     state.departments = [action.payload.data]; // Reset to an array if it's undefined
      //   }
      // })
      .addCase(addDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;

        // Ensure state.departments is always an array before using findIndex
        if (!Array.isArray(state.departments)) {
          state.departments = [];
        }

        const index = state.departments.findIndex(
          (dept) => dept.id === action.payload.id
        );

        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      })

      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(removeDepartment.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.departments = state.departments.filter(
      //     (dept) => dept.id !== action.payload.id
      //   );
      // })
      .addCase(removeDepartment.fulfilled, (state, action) => {
              state.loading = false;
      
              // Ensure state.customers is an array before filtering
              if (!Array.isArray(state.departments)) {
                state.departments = [];
              }
      
              state.departments = state.departments.filter(
                (dept) => dept.id !== action.payload.id
              );
            })
      .addCase(removeDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default departmentSlice.reducer;
