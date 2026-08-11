import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./TaskScheduleManageData.css";
import { iconsImgs } from "../../../utils/images";
import ContentTop from "../../ContentTop/ContentTop";
import Pagination from "./Pagination";
import axios from "axios";
import TaskSheduleTable from "./TaskSheduleTable";
import EditTaskShedule from "./EditTaskShedule";
import AddTaskSchedule from "./AddTaskSchedule";
import ViewTaskShedule from "./ViewTaskShedule";
import { useLocation } from "react-router-dom";
import { fetchCurrentUser } from "../../../redux/authSlice";
import { fetchAllUsers } from "../../../redux/userSlice";

import {
  useGetTasksQuery,
  useAddTaskMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useLazyGetTaskByIdQuery,
} from "../../../redux/services/taskService";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const TaskScheduleManageData = () => {
  const { hasPermission } = useUserPermissionCheck();

  const dispatch = useDispatch();

  const { user: userDetail } = useSelector((state) => state.auth);
  //console.log("userDetail",userDetail?.employeeRole?.role_id);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const [selectedTask, setSelectedTask] = useState({});
  const [isAddtaskopen, setIsAddTaskOpen] = useState(false);
  const [isViewtaskopen, setIsViewTaskOpen] = useState(false);
  const [isEdittaskopen, setIsEditTaskOpen] = useState(false);

  //get url parameter
  const location = useLocation();
  const pathSegments = location.pathname.split("/"); // ['','my-task','taskshedule-management']

  const myTaskValue = pathSegments[1]; // 'my-task'
  //console.log("myTaskValue", myTaskValue);

  //end get url parameter

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const taskPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  const { allusers } = useSelector((state) => state.user);

  // RTK Query
  const { data, error, isLoading, refetch } = useGetTasksQuery({
    page: currentPage,
    limit: taskPerPage,
    search: searchTerm,
  });

  // Redux thunk dispatch for employee list
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [isAddtaskopen, isEdittaskopen]);

  const [addTask, { isSuccess, isError, error: baerror }] =
    useAddTaskMutation();

  const [
    editTask,
    { isSuccess: editisSuccess, isError: isIsError, error: editBaerror },
  ] = useEditTaskMutation();

  // const [
  //   getTaskById,
  //   { isSuccess: viewisSuccess, isError: viewIsError, error: viewerror },
  // ] = useGetTaskByIdQuery();

  const [
    getTaskById,
    {
      data: taskData,
      isSuccess: viewisSuccess,
      isError: viewIsError,
      error: viewerror,
    },
  ] = useLazyGetTaskByIdQuery();

  const [deleteTask] = useDeleteTaskMutation();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //add business associate
  const [formData, setFormData] = useState({
    task_title: "",
    description: "",
    assigned_to: "",
    due_date: "",
    status: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 1000);
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Clear error when user types
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateInputs = () => {
    let errors = {};

    if (!formData.task_title.trim())
      errors.task_title = "*Task title is required";

    if (!formData.description.trim())
      errors.description = "*Description is required";

    if (!formData.assigned_to)
      errors.assigned_to = "*Please assign the task to someone";

    if (!formData.due_date) errors.due_date = "*Due date is required";

    if (!formData.status) errors.status = "*Status is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAddTask = async (e) => {
    e.preventDefault();

    if (validateInputs()) {
      try {
        const response = await addTask(formData).unwrap();

        if (response?.success) {
          handleFlashMessage(response?.message, "success");

          await refetch();

          setTimeout(() => {
            setIsAddTaskOpen(false);
          }, 1000);

          setFormData({});
        }
      } catch (error) {
        console.error("Error adding task Sheduled:", error);
        const errors = error?.data?.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          handleFlashMessage(errors.join("\n"), "error");
        } else {
          handleFlashMessage(
            error?.data?.message || "Something went wrong",
            "error"
          );
        }
      }
    }
  };

  //edit task
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    task_title: "",
    description: "",
    assigned_to: "",
    due_date: "",
    status: "",
    salesperson_remark: "",
  });

  const [editFormErrors, setEditFormErrors] = useState({});
  const [editFlashMessage, setEditFlashMessage] = useState("");
  const [editFlashMsgType, setEditFlashMsgType] = useState("");

  // Prefill form when selectedTask changes
  useEffect(() => {
    if (selectedTask) {
      setEditFormData({
        task_title: selectedTask?.task_title || "",
        description: selectedTask?.description || "",
        assigned_to: selectedTask?.assigned_to || "",
        due_date: selectedTask?.due_date || "",
        status: selectedTask?.status || "",
        salesperson_remark: selectedTask?.salesperson_remark || "",
      });
    }
  }, [selectedTask?.id]);

  // Flash message handler
  const handleEditFlashMessage = (message, type) => {
    setEditFlashMessage(message);
    setEditFlashMsgType(type);
    setTimeout(() => {
      setEditFlashMessage("");
      setEditFlashMsgType("");
    }, 1000);
  };

  // OnChange handler
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    setEditFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Validation
  const validateEditInputs = () => {
    let errors = {};
    if (!editFormData.task_title.trim())
      errors.task_title = "*Task title is required";
    if (!editFormData.description.trim())
      errors.description = "*Description is required";
    if (!editFormData.assigned_to)
      errors.assigned_to = "*Assigned to is required";
    if (!editFormData.due_date) errors.due_date = "*Due date is required";
    if (!editFormData.status) errors.status = "*Status is required";

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    //if (validateEditInputs()) {
    try {
      const response = await editTask({
        id: selectedTask?.id,
        updatedData: editFormData,
      }).unwrap();

      //console.log("Edit response:", response);

      if (response.success) {
        handleEditFlashMessage(response.message, "success");
        await refetch(); // if you have useGetTasksQuery refetch method
        setTimeout(() => {
          setIsEditTaskOpen(false);
        }, 1000);
      } else {
        handleEditFlashMessage(
          response?.message || "Something went wrong",
          "error"
        );
      }
    } catch (error) {
      console.error("Error editing task:", error);
      handleEditFlashMessage(
        error?.data?.message || "An error occurred",
        "error"
      );
    }
    //}
  };

  //end edit task
  //delete functinality
  const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
  const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

  // Function to show flash messages for delete actions
  const handleDeleteFlashMessage = (message, type) => {
    setDeleteFlashMessage(message);
    setDeleteFlashMsgType(type);
    setTimeout(() => {
      setDeleteFlashMessage("");
      setDeleteFlashMsgType("");
    }, 1000); // Hide the message after 3 seconds
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id).unwrap();
      handleDeleteFlashMessage("Task deleted successfully!", "success");
      await refetch();
    } catch (error) {
      handleDeleteFlashMessage(
        error?.message || "Failed to delete task",
        "error"
      );
    }
  };
  //end delete functionality
  //export BA data in excel file
  const taskDatas = data?.data;
  const handleExportData = () => {
    const exportData = taskDatas.map((task, index) => ({
      "Sr. No.": index + 1,
      Title: task?.task_title || "-",
      "Assigned To": task?.assignedUser?.fullname || "-",
      "Due Date": task?.due_date
        ? new Date(task.due_date).toLocaleDateString("en-GB")
        : "-",
      Status: task?.status || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Optional: Customize column widths
    worksheet["!cols"] = [
      { wch: 10 }, // Sr. No.
      { wch: 30 }, // Title
      { wch: 25 }, // Assigned To
      { wch: 15 }, // Due Date
      { wch: 15 }, // Status
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `Task_Report_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    saveAs(data, fileName);
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              {myTaskValue === "my-task" ? "My Task List" : "Task Management"}
            </h1>
          </div>
          <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
            <div className="md:mb-0 mb-2">
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {userDetail?.employeeRole?.role_id == 1 && (
              <div>
                {hasPermission(12, 1) && (
                  <button
                    className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                    onClick={() => setIsAddTaskOpen(true)}
                  >
                    <img
                      src={iconsImgs.plus}
                      alt="plus icon"
                      className="w-[18px] mr-1"
                    />{" "}
                    Add Task
                  </button>
                )}
              </div>
            )}
            <div>
              <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={handleExportData}
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
        <div className="main-content-holder max-h-[460px] heightfixalldevice overflow-y-auto scrollbar-hide">
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {/*--------- New Pagination Code Start  ---------*/}
            <div className="flex justify-end items-center mb-5 text-white rounded-md font-sans gap-10">
              <div className="flex items-center">
                <span className="text-sm text-white bg-[#473b33] rounded-l-[5px] flex items-center text-center px-3 h-8">
                  Show Data
                </span>
                <div className="relative cursor-pointer">
                  <select
                    className="appearance-none cursor-pointer h-8 pr-8 pl-5 rounded-r-[5px] bg-[#3d3d57] text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                    value={entriesPerPageNewData}
                    onChange={(e) => {
                      setEntriesPerPageNewData(Number(e.target.value));
                    }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={75}>75</option>
                    <option value={100}>100</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-300">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/*--------- New Pagination Code End  ---------*/}
            {/*------- Table Data Start -------*/}
            <TaskSheduleTable
              setIsEditTaskOpen={setIsEditTaskOpen}
              setIsViewTaskOpen={setIsViewTaskOpen}
              taskData={data?.data}
              setSelectedTask={setSelectedTask}
              handleDelete={handleDelete}
              deleteFlashMessage={deleteFlashMessage}
              deleteFlashMsgType={deleteFlashMsgType}
              getTaskById={getTaskById}
              empRole={userDetail?.employeeRole?.role_id}
            />
            {/*------- Table Data End -------*/}
          </div>
        </div>

        {/* Edit User Modal */}
        {isEdittaskopen && (
          <EditTaskShedule
            setIsEditTaskOpen={setIsEditTaskOpen}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            editFormErrors={editFormErrors}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
            editFlashMessage={editFlashMessage}
            editFlashMsgType={editFlashMsgType}
            employeeList={allusers?.data}
            selectedTask={selectedTask}
            empRole={userDetail?.employeeRole?.role_id}
          />
        )}

        {/* View User Modal */}
        {isViewtaskopen && (
          <ViewTaskShedule
            setIsViewTaskOpen={setIsViewTaskOpen}
            taskData={taskData}
          />
        )}

        {/* Assign Customer Modal */}
        {isAddtaskopen && (
          <AddTaskSchedule
            setIsAddTaskOpen={setIsAddTaskOpen}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleChange={handleChange}
            handleSubmitAddTask={handleSubmitAddTask}
            flashMessage={flashMessage}
            flashMsgType={flashMsgType}
            employeeList={allusers?.data}
          />
        )}
        {/* Pagination Controls with Number */}
        <Pagination
          currentPage={data?.currentPage}
          handlePageChange={handlePageChange}
          totalPages={data?.totalPages}
        />
      </div>
    </div>
  );
};

export default TaskScheduleManageData;
