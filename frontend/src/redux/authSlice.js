import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define API base URL
//const API_URL = "http://localhost:5000/api";
const API_URL = import.meta.env.VITE_API_URL;

// Get token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// ✅ LOGIN USER (Keeps existing logic)
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, userData);
      localStorage.setItem("token", response.data.token); // Store token
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ LIST ROLES
export const listRoles = createAsyncThunk(
  "auth/roleList",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/roleList`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, search }, // Pass pagination & search params
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch roles");
    }
  }
);

//fetch all roles
export const fetchAllRoles = createAsyncThunk(
  "auth/fetchAllRoles",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/roleList`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { all: true }, // Fetch all roles
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all roles"
      );
    }
  }
);

// ✅ ADD ROLE
export const addRole = createAsyncThunk(
  "auth/addRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_URL}/auth/addRole`, roleData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add role");
    }
  }
);

// ✅ UPDATE ROLE
export const updateRole = createAsyncThunk(
  "auth/updateRole",
  async ({ id, roleData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_URL}/auth/updateRole/${id}`,
        roleData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update role");
    }
  }
);

// ✅ DELETE ROLE
export const removeRole = createAsyncThunk(
  "auth/removeRole",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/auth/removeRole/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete role");
    }
  }
);

//Fetch current user
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/currentLoginuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

// 🔹 AUTH SLICE WITH ROLE MANAGEMENT
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    roles: [], // Added roles state
    allRoles: [],
    roleLoading: false,
    roleError: null,
    totalPages: 1,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ LOGIN HANDLING (Existing)
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      //all roles

      .addCase(fetchAllRoles.pending, (state) => {
        state.roleLoading = true;
        state.roleError = null;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.roleLoading = false;
        state.allRoles = action.payload;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.roleLoading = false;
        state.roleError = action.payload;
      })

      // ✅ LIST ROLES
      .addCase(listRoles.pending, (state) => {
        state.roleLoading = true;
        state.roleError = null;
      })
      .addCase(listRoles.fulfilled, (state, action) => {
        state.roleLoading = false;
        state.roles = action.payload;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(listRoles.rejected, (state, action) => {
        state.roleLoading = false;
        state.roleError = action.payload;
      })

      // ✅ ADD ROLE
      .addCase(addRole.pending, (state) => {
        state.roleLoading = true;
        state.roleError = null;
      })
       .addCase(addRole.fulfilled, (state, action) => {
              // ✅ Add new customer to existing state without re-fetching
              state.roles.data = [
                action.payload.data,
                ...state.roles.data,
              ];
            })
      // .addCase(addRole.fulfilled, (state, action) => {
      //   state.roleLoading = false;
      //   const roleData = action.payload.data; // ✅ Extract data

      //   if (!Array.isArray(state.roles)) {
      //     state.roles = []; // Ensure it's an array
      //   }

      //   if (roleData) {
      //     state.roles.push(roleData); // ✅ Add new role to the array
      //   }
      // })
      .addCase(addRole.rejected, (state, action) => {
        state.roleLoading = false;
        state.roleError = action.payload;
      })

      // ✅ UPDATE ROLE
      .addCase(updateRole.pending, (state) => {
        state.roleLoading = true;
        state.roleError = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.roleLoading = false;

        if (!Array.isArray(state.roles)) {
          state.roles = []; // Ensure roles is an array
        }

        const index = state.roles.findIndex(
          (role) => role.id === action.payload.id
        );
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.roleLoading = false;
        state.roleError = action.payload;
      })

      // ✅ DELETE ROLE
      .addCase(removeRole.pending, (state) => {
        state.roleLoading = true;
        state.roleError = null;
      })
      // .addCase(removeRole.fulfilled, (state, action) => {
      //   state.roleLoading = false;
      //   state.roles = state.roles.filter(
      //     (role) => role.id !== action.payload.id
      //   );
      // })
       .addCase(removeRole.fulfilled, (state, action) => {
                    state.roleLoading = false;
            
                    // Ensure state.customers is an array before filtering
                    if (!Array.isArray(state.roles)) {
                      state.roles = [];
                    }
            
                    state.roles = state.roles.filter(
                      (role) => role.id !== action.payload.id
                    );
                  })
      .addCase(removeRole.rejected, (state, action) => {
        state.roleLoading = false;
        state.roleError = action.payload;
      })

      // ✅ FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Store user data in state
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
