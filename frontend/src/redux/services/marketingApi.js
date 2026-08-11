import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

export const marketingApi = createApi({
  reducerPath: "marketingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({

    // 📋 Get Marketing List
    getMarketing: builder.query({
      query: ({ page = 1, limit = 20, search = "" } = {}) => ({
        url: `auth/get-all-marketing?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
    }),

    // ➕ Add Marketing
    addMarketing: builder.mutation({
      query: (newMarketing) => ({
        url: "auth/add-marketing",
        method: "POST",
        body: newMarketing,
      }),
    }),

    // ✏️ Edit Marketing
    editMarketing: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `auth/update-marketing/${id}`,
        method: "PUT",
        body: updatedData,
      }),
    }),

    // 🗑️ Delete Marketing
    deleteMarketing: builder.mutation({
      query: (id) => ({
        url: `auth/delete-marketing/${id}`,
        method: "DELETE",
      }),
    }),

    // 📃 Get Marketing by ID
    getMarketingById: builder.query({
      query: (id) => ({
        url: `auth/get-marketing/${id}`,
        method: "GET",
      }),
    }),

    // 📋 Get My Marketing
    getMyMarketing: builder.query({
      query: () => ({
        url: `auth/marketing/my-marketing`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useGetMarketingQuery,
  useAddMarketingMutation,
  useEditMarketingMutation,
  useDeleteMarketingMutation,
  useGetMarketingByIdQuery,
  useLazyGetMarketingByIdQuery,
  useGetMyMarketingQuery
} = marketingApi;
