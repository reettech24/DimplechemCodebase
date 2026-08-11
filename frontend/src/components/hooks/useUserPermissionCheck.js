import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetModulesQuery,
  useGetUserRightsQuery,
} from "../../redux/services/permissionsApi";
import { fetchCurrentUser } from "../../redux/authSlice";

export const useUserPermissionCheck = () => {
  const dispatch = useDispatch();
  const { user: userDeatail } = useSelector((state) => state.auth);
  const hasFetchedUser = useRef(false);
  //console.log("userDeatail",userDeatail);
useEffect(() => {
    if (!userDeatail?.id && !hasFetchedUser.current) {
      dispatch(fetchCurrentUser());
      hasFetchedUser.current = true;
    }
  }, [userDeatail?.id]);

  const userId = userDeatail?.id;

  const {
    data: modulesData,
    isLoading: modulesLoading,
    isError: modulesError,
  } = useGetModulesQuery();

  const {
    data: rightsData,
    isLoading: rightsLoading,
    isError: rightsError,
  } = useGetUserRightsQuery(userId, {
    skip: !userId,
  });

  //console.log("rightsData",rightsData?.permissions);

  const hasPermission = (moduleId, actionId) => {
    if (!modulesData || !rightsData) return false;

    const module = modulesData?.data?.find((mod) => mod.id === moduleId);
    if (!module) return false;

    const modulePermissions = rightsData?.permissions?.find(
      (p) => p.module_id === module.id
    );
    if (!modulePermissions) return false;

    return modulePermissions.permission_ids.includes(actionId);
  };

  return {
    hasPermission,
    isLoading: modulesLoading || rightsLoading,
    isError: modulesError || rightsError,
  };
};
