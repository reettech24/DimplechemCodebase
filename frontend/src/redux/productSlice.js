import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

// ✅ LIST PRODUCTS
export const listProducts = createAsyncThunk(
  "auth/allProducts",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/allProducts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

// ✅ FETCH ALL PRODUCTS
export const fetchAllProducts = createAsyncThunk(
  "auth/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/allProducts`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { all: true },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch all products"
      );
    }
  }
);

// ✅ ADD PRODUCT
export const addProduct = createAsyncThunk(
  "auth/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_URL}/auth/addProduct`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add product");
    }
  }
);

// ✅ UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
  "auth/updateProduct",
  async ({ id, ProductData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_URL}/auth/updateProduct/${id}`,
        ProductData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update product"
      );
    }
  }
);

// ✅ DELETE PRODUCT
export const removeProduct = createAsyncThunk(
    "auth/deleteProduct",
    async (id, { rejectWithValue }) => {
      try {
        const token = getAuthToken();
        const response = await axios.put(
          `${API_URL}/auth/deleteProduct/${id}`,
          {}, // Empty body (if required by the API)
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return { id };
      } catch (error) {
        return rejectWithValue(
          error.response?.data || "Failed to delete product"
        );
      }
    }
  );
  

// 🔹 PRODUCT SLICE
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    allProducts: [],
    productLoading: false,
    productError: null,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.allProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })
      .addCase(listProducts.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.products = action.payload;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })

      .addCase(addProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.data = [action.payload.data, ...state.products.data];
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.productLoading = false;

        // Ensure state.products is always an array before using findIndex
        if (!Array.isArray(state.products)) {
          state.products = [];
        }

        const index = state.products.findIndex(
          (prod) => prod.id === action.payload.id
        );

        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })

      .addCase(removeProduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.productLoading = false;

        // Ensure state.products is an array before filtering
        if (!Array.isArray(state.products)) {
          state.products = [];
        }

        state.products = state.products.filter(
          (prod) => prod.id !== action.payload.id
        );
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      });
  },
});

export default productSlice.reducer;
