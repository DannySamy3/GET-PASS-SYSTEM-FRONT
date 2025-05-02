"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyCode } from "@/utils/authController";
import { showToast } from "@/utils/toastSlice";
import { useRouter } from "next/navigation";
import { setToken, selectToken } from "@/utils/registrationSlice";
import ToastNotification from "../toastNotification/ToastNotification";
import { reSendToken } from "@/utils/authController";

const VerifyToken = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const tokenCode = useSelector(selectToken) || ""; // Ensure default value

  const email = useSelector((state: any) => state.registration.email); // Access email state

  const handleChange = (e: any) => {
    const { value } = e.target; // Correct access of the value
    dispatch(setToken(value)); // Update tokenCode in Redux
  };

  const verifyToken = async () => {
    setLoading(true);
    try {
      const response = await verifyCode(email, tokenCode);

      if (response.statusText) {
        dispatch(
          // @ts-ignore
          showToast({ message: response?.data.message, type: "success" })
        );
        router.push("/registerDetails");
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({ message: err.response?.data?.message, type: "error" })
      );
    } finally {
      setLoading(false);
    }
  };
  const resendToken = async () => {
    setLoading(true);
    try {
      const response = await reSendToken(email);

      if (response.statusText) {
        dispatch(
          // @ts-ignore
          showToast({ message: response?.data.message, type: "success" })
        );
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({ message: err.response?.data?.message, type: "error" })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='font-montserrat w-[50%] h-screen overflow-y-hidden mt-64'>
      <h2 className='flex justify-center text-black font-montserrat font-[500] mb-6 text-[32px]'>
        CREATE ACCOUNT
      </h2>
      <div className='flex flex-col gap-3 w-[50%] mx-auto font-[500] text-[#292727] text-[14px] mb-8'>
        <p>
          Verification code has been sent to the email below.
          <br /> Please check your email and submit the code you received
        </p>
        <p className='font-[500] text-red-600 mt-4'>{email}</p>
      </div>

      <section className='w-[50%] mx-auto flex flex-col gap-3'>
        <input
          name='text'
          value={tokenCode} // Ensuring value is always set to a string
          placeholder='Enter verification code'
          className='input input-bordered w-full text-sm'
          required
          onChange={handleChange}
        />
        <div className=' flex justify-end '>
          <p
            onClick={resendToken}
            className=' text-[#1795F4]  font-[500] cursor-pointer text-[13px]'
          >
            resend code
          </p>
        </div>

        <div className='w-full my-4'>
          <button
            onClick={verifyToken}
            disabled={loading || !email}
            className='bg-[#1683CF] text-[14px] font-[600] border w-full py-3 text-white rounded-lg flex items-center justify-center'
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
              "Submit Code"
            )}
          </button>
        </div>
      </section>
      <ToastNotification />
    </div>
  );
};

export default VerifyToken;
