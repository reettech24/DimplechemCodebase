import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");
// if you're using a utility function for token

export const businessAssociateApi = createApi({
  reducerPath: "businessAssociateApi",
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
    getBusinessAssociates: builder.query({
      query: ({
        page = 1,
        limit = 20,
        search = "",
        entriesPerPageNewData = "",
      } = {}) => ({
        url: `auth/listBusinessAssociates?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
    }),

    // 👇 Add business associate mutation
    addBusinessAssociate: builder.mutation({
      query: (newAssociate) => ({
        url: "auth/add-business-associate",
        method: "POST",
        body: newAssociate,
      }),
    }),

    // ✅ Edit Business Associate
    editBusinessAssociate: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `auth/business-associates/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["BusinessAssociates"],
    }),

    // ✅ Delete Business Associate
    deleteBusinessAssociate: builder.mutation({
      query: (id) => ({
        url: `auth/business-associates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BusinessAssociates"],
    }),
  }),
});

export const {
  useGetBusinessAssociatesQuery,
  useAddBusinessAssociateMutation,
  useEditBusinessAssociateMutation,
  useDeleteBusinessAssociateMutation,
} = businessAssociateApi;
