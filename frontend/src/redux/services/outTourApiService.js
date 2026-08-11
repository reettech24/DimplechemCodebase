import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

export const outTourApi = createApi({
  reducerPath: "outTourApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL, // update with your actual API base
    prepareHeaders: (headers, { getState }) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["OutTour"],
  endpoints: (builder) => ({
    // 📌 Add Out Tour
    addOutTour: builder.mutation({
      query: (data) => ({
        url: "auth/out-tours",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["OutTour"],
    }),

    // 📌 Get All Out Tours
    getOutTours: builder.query({
      query: (params) => {
        const query = new URLSearchParams(params).toString();
        return `auth/out-tours?${query}`;
      },
      providesTags: ["OutTour"],
    }),

    // 📌 Get Out Tour by ID
    getOutTourById: builder.query({
      query: (id) => `auth/out-tours/${id}`,
      providesTags: (result, error, id) => [{ type: "OutTour", id }],
    }),

    updateOutTour: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `auth/out-tours/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["OutTour"],
    }),

    // 📌 Delete Out Tour
    deleteOutTour: builder.mutation({
      query: (id) => ({
        url: `auth/out-tours/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OutTour"],
    }),
  }),
});

export const {
  useAddOutTourMutation,
  useGetOutToursQuery,
  useGetOutTourByIdQuery,
  useDeleteOutTourMutation,
  useUpdateOutTourMutation
} = outTourApi;
