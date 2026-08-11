import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

export const localExpenseApi = createApi({
  reducerPath: "localExpenseApi",
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
  tagTypes: ["LocalExpense"],
  endpoints: (builder) => ({
    // Add Local Expense
    addLocalExpense: builder.mutation({
      query: (data) => ({
        url: "auth/local-expenses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LocalExpense"],
    }),

    // Get All Local Expenses
    getLocalExpenses: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `auth/local-expenses?${query}`;
      },
      providesTags: ["LocalExpense"],
    }),

    // Get Local Expense by ID
    getLocalExpenseById: builder.query({
      query: (id) => `auth/local-expenses/${id}`,
      providesTags: (result, error, id) => [{ type: "LocalExpense", id }],
    }),

    // Update Local Expense
    updateLocalExpense: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `auth/local-expenses/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["LocalExpense"],
    }),

    // Delete Local Expense
    deleteLocalExpense: builder.mutation({
      query: (id) => ({
        url: `auth/local-expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LocalExpense"],
    }),

    // Export Local Expenses to Excel
    exportLocalExpenses: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `auth/local-expenses-export?${queryString}`,
          method: "GET",
          responseHandler: (response) => response.blob(),
        };
      },
    }),

  }),
});

export const {
  useAddLocalExpenseMutation,
  useGetLocalExpensesQuery,
  useGetLocalExpenseByIdQuery,
  useUpdateLocalExpenseMutation,
  useDeleteLocalExpenseMutation,
  useExportLocalExpensesQuery,
  useLazyExportLocalExpensesQuery
} = localExpenseApi;
