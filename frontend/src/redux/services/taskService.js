import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

export const taskApi = createApi({
  reducerPath: "taskApi",
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
    // 🔍 Get Task List
    getTasks: builder.query({
      query: ({
        page = 1,
        limit = 20,
        search = "",
        entriesPerPageNewData = "",
      } = {}) => ({
        url: `auth/tasks?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
    }),

    // ➕ Add Task
    addTask: builder.mutation({
      query: (newTask) => ({
        url: "auth/create-task",
        method: "POST",
        body: newTask,
      }),
    }),

    // ✏️ Edit Task
    editTask: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `auth/update-tasks/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // 🗑️ Delete Task
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `auth/delete-task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),

    // 📃 Get Task by ID (optional)
    getTaskById: builder.query({
      query: (id) => ({
        url: `auth/task/${id}`,
        method: "GET",
      }),
    }),

    //get my task
    getMyTasks: builder.query({
      query: () => ({
        url: `auth/tasks/my-tasks`,
        method: "GET",
      }),
    }),

  }),
});

export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useLazyGetTaskByIdQuery,
  useGetMyTasksQuery 
} = taskApi;
