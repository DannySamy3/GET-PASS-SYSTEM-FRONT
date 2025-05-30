"use client";
import React, { useEffect, useReducer } from "react";

import { sendToken } from "@/utils/authController";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmail,
  setEmailError,
  selectEmailError,
} from "@/utils/registrationSlice"; // Import actions and state from registration slice
import { showToast } from "@/utils/toastSlice";

import ToastNotification from "../toastNotification/ToastNotification";
import { useRouter } from "next/navigation";

const Register = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const emailError = useSelector(selectEmailError);

  function isInvalidEmailFormat(email: string) {
    // Regular expression to match a valid email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Test the email against the regex
    return !emailRegex.test(email); // Returns true if invalid, false if valid
  }

  const emailValidationError = useSelector(
    (state: any) => state.registration.emailError
  ); // Access email error state

  // Handle email change and validate email format
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    console.log(emailValue);

    if (isInvalidEmailFormat(emailValue)) {
      dispatch(setEmailError(true));
    }
    if (!isInvalidEmailFormat(emailValue)) {
      dispatch(setEmailError(false));
    }

    if (!emailValue) {
      dispatch(setEmailError(false));
    }
    dispatch(setEmail(emailValue));
  };
  const email = useSelector((state: any) => state.registration.email); // Access email state

  const requestToken = async () => {
    setLoading(true);
    try {
      const response = (await sendToken(email)) as {
        status: number;
        data: { message: string };
      };

      if (response.status >= 200 && response.status < 300) {
        dispatch(
          showToast({ message: response.data.message, type: "success" })
        );
        router.push("/verifyToken");
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message: err.response?.data?.message,
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  return (
    <div className='font-montserrat w-full lg:w-[50%] h-fit overflow-y-hidden mt-8 lg:mt-64 px-6 lg:px-0'>
      <h2 className='flex justify-center text-black font-montserrat font-[500] mb-6 text-[28px] lg:text-[32px]'>
        CREATE ACCOUNT
      </h2>
      <p className='w-full lg:w-[50%] mx-auto font-[500] text-[#292727] text-[14px] mb-8 text-center max-w-md'>
        Please enter the email address you wish to use for registration.
        Verification Code Will be Sent to it
      </p>

      <div className='w-full lg:w-[50%] mx-auto space-y-4 max-w-md'>
        <input
          name='email'
          placeholder='Enter your email address'
          className={`input input-bordered w-full text-base ${
            emailError ? "focus:input-error input-error" : ""
          }`}
          required
          onChange={(e: any) => handleEmailChange(e)}
        />

        {emailError && (
          <p className='text-sm text-red-600'>
            Please enter a valid email address format
          </p>
        )}

        <div className='w-full'>
          <button
            onClick={requestToken}
            disabled={loading || emailError || !email}
            className={`bg-[#1683CF] ${
              emailError || !email
                ? "disabled bg-gray-300 cursor-not-allowed"
                : ""
            } text-[14px] font-[600] border w-full py-3 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors`}
          >
            {loading ? (
              <div className='flex items-center justify-center'>
                <svg
                  className='animate-spin h-5 w-5 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M12 2a10 10 0 0110 10h-4a6 6 0 00-6-6V2z'
                  ></path>
                </svg>
              </div>
            ) : (
              "Send Code"
            )}
          </button>
        </div>
      </div>
      <ToastNotification />
    </div>
  );
};

export default Register;
