import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import departmentReducer from "./departmentSlice";
import useReducer from "./userSlice";
import customerReducer from "./customerSlice";
import leadReducer from "./leadSlice";
import productReducer from "./productSlice";
import costWorkingReducer from "./costWorkingSlice";
import poaReducer from "./poaSlice";
import categoryReducer from "./categorySlice";
import googleCalenderAuthReducer from "./googleCalenderAuthSlice";
import googleGmailAuthReducer from "./googleGmailAuthSlice";
import { businessAssociateApi } from "./services/businessAssociateService";
import { taskApi } from "./services/taskService";
import { outTourApi } from "./services/outTourApiService";
import { localExpenseApi } from "./services/localExpenseApi";
import { marketingApi } from "./services/marketingApi";
import { permissionsApi } from "./services/permissionsApi";
import { leaveApi } from "./services/leaveService";

const store = configureStore({
  reducer: {
    auth: authReducer,
    department: departmentReducer,
    user: useReducer,
    customer: customerReducer,
    lead: leadReducer,
    product: productReducer, // add product reducer here...
    costWorking: costWorkingReducer,
    poa: poaReducer,
    category: categoryReducer,
    googleCalenderAuth: googleCalenderAuthReducer,
    googleGmailAuth: googleGmailAuthReducer,

    [businessAssociateApi.reducerPath]: businessAssociateApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    [outTourApi.reducerPath]: outTourApi.reducer,
    [localExpenseApi.reducerPath]: localExpenseApi.reducer,
    [marketingApi.reducerPath]: marketingApi.reducer,
    [permissionsApi.reducerPath]: permissionsApi.reducer,
    [leaveApi.reducerPath]: leaveApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(businessAssociateApi.middleware)
      .concat(taskApi.middleware)
      .concat(outTourApi.middleware)
      .concat(localExpenseApi.middleware)
      .concat(marketingApi.middleware)
      .concat(permissionsApi.middleware)
      .concat(leaveApi.middleware),
});

export default store;
