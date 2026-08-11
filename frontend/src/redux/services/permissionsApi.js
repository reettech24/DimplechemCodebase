import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

export const permissionsApi = createApi({
  reducerPath: "permissionsApi",
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
    getModules: builder.query({
      query: () => "/auth/modules",
    }),
    getUserRights: builder.query({
      query: (userId) => `/auth/getUserRights/${userId}`,
    }),
  }),
});

export const { useGetModulesQuery, useGetUserRightsQuery } = permissionsApi;
