import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

export const leaveApi = createApi({
  reducerPath: "leaveApi",
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
  tagTypes: ["Leaves"], // optional: for cache invalidation
  endpoints: (builder) => ({
    // 📄 Get all leave data (Admin)
    getAllLeaveData: builder.query({
      query: () => ({
        url: "leave",
        method: "GET",
      }),
      providesTags: ["Leaves"],
    }),

    // 📄 Get all leave requests (Admin view)
    getAllLeaveRequests: builder.query({
      query: ({
        page = 1,
        limit = 20,
        search = "",
        status = "",
        entriesPerPageNewData = "",
      } = {}) => ({
        url: `auth/leave-requests?page=${page}&limit=${limit}&search=${search}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["Leaves"],
    }),

    // 📝 Apply leave
    applyLeave: builder.mutation({
      query: (leaveData) => {
        const formData = new FormData();

        // Append all non-file fields
        Object.keys(leaveData).forEach((key) => {
          if (key !== "documents") {
            formData.append(key, leaveData[key]);
          }
        });

        // Append multiple files
        if (leaveData.documents && leaveData.documents.length > 0) {
          leaveData.documents.forEach((file) => {
            formData.append("documents", file); // field name "documents" matches backend
          });
        }

        return {
          url: "auth/apply-leave",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Leaves"],
    }),

    // ✏️ Update multiple leaves
    updateMultipleLeaves: builder.mutation({
      query: (updateData) => ({
        url: "update-leave",
        method: "POST",
        body: updateData,
      }),
      invalidatesTags: ["Leaves"],
    }),

    // ✅ Approve / ❌ Reject leave
    approveRejectLeave: builder.mutation({
      query: ({ id, status }) => ({
        url: `auth/approve-reject-leave/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Leaves"],
    }),

    // 🙋‍♂️ My leaves (for logged-in user)
    getMyLeaves: builder.query({
      query: ({
        page = 1,
        limit = 20,
        search = "",
        status = "",
        entriesPerPageNewData = "",
      } = {}) => ({
        url: `auth/my-leave?page=${page}&limit=${limit}&search=${search}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["Leaves"],
    }),

    // 🗑️ Delete leave
    deleteLeave: builder.mutation({
      query: (id) => ({
        url: `delete-leave/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leaves"],
    }),
  }),
});

export const {
  useGetAllLeaveDataQuery,
  useGetAllLeaveRequestsQuery,
  useApplyLeaveMutation,
  useUpdateMultipleLeavesMutation,
  useApproveRejectLeaveMutation,
  useGetMyLeavesQuery,
  useDeleteLeaveMutation,
} = leaveApi;
