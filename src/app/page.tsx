"use client";
import React from "react";
import Login from "@/components/login/Login";

import { useSelector, useDispatch } from "react-redux";
import {
  selectIsLogin,
  setIsLogin,
  setHideLogin,
  selectHideLogin,
} from "@/utils/authSlice";

const page = () => {
  // Correctly using useSelector now
  const loginHide = useSelector(selectHideLogin);
  const dispatch = useDispatch(); // Initialize dispatch if you want to use actions
  // const router = useRouter();
  const handleSetIsLogin = (value: boolean) => {
    dispatch(setHideLogin(value)); // Use dispatch to update the Redux store
  };
  const handleLoginSuccess = (value: boolean) => {
    dispatch(setIsLogin(value)); // Use dispatch to update the Redux store
  };

  return (
    <div>
      <Login
        onLoginSuccess={handleLoginSuccess}
        hideLogin={handleSetIsLogin}
        loginHide={loginHide}
      />
    </div>
  );
};

export default page;
