import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

// ✅ List paginated categories
export const listCategories = createAsyncThunk(
  "category/listCategories",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch categories"
      );
    }
  }
);

// ✅ Fetch all categories (without pagination)
export const fetchAllCategories = createAsyncThunk(
  "category/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { all: true },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all categories"
      );
    }
  }
);


// ✅ Add new category
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_URL}/auth/addCategory`,
        categoryData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to add category"
      );
    }
  }
);

// ✅ Update category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_URL}/auth/updateCategory/${id}`,
        categoryData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update category"
      );
    }
  }
);

// ✅ Delete category
export const removeCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      await axios.put(`${API_URL}/auth/deleteCategory/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete category"
      );
    }
  }
);

// 🔹 CATEGORY SLICE
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    allCategories: [],
    
    categoryLoading: false,
    categoryError: null,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 fetchAllCategories
      .addCase(fetchAllCategories.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.allCategories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
      })

    

      // 🔹 listCategories
      .addCase(listCategories.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(listCategories.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categories = action.payload;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(listCategories.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
      })

      // 🔹 addCategory
      .addCase(addCategory.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.data = [action.payload.data, ...(state.categories?.data || [])];
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
      })

      // 🔹 updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        const index = state.categories.data?.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories.data[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
      })

      // 🔹 removeCategory
      .addCase(removeCategory.pending, (state) => {
        state.categoryLoading = true;
        state.categoryError = null;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
        state.categories.data = state.categories.data?.filter(
          (cat) => cat.id !== action.payload.id
        );
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.categoryError = action.payload;
      });
  },
});

export default categorySlice.reducer;
