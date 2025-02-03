"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { handleLogin } from "@/utils/authController";
import { showToast } from "@/utils/toastSlice";
import { selectLogin, loginSuccess } from "../../utils/authenticatorSlice";
import ToastNotification from "../toastNotification/ToastNotification";
import { AppDispatch, RootState } from "@/utils/store";

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [input, setInput] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState(false);
  const { loading, error } = useSelector(
    (state: RootState) => state.authenticator
  );
  const login = useSelector(selectLogin);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const isInvalidEmailFormat = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !emailRegex.test(email);
  };

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email" && value !== "") {
      setEmailError(isInvalidEmailFormat(value));
    }
    if (name === "email" && value == "") {
      setEmailError(false);
    }

    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const implementLogin = async () => {
    try {
      const response = await handleLogin({
        email: input.email,
        password: input.password,
      });

      if (response.status === 200) {
        router.replace("/dashboard");

        dispatch(
          loginSuccess({ token: response.data.token, user: response.data.user })
        );
        dispatch(
          showToast({ message: response.data.message, type: "success" })
        );
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({ message: err.response?.data?.message, type: "error" })
      );
    }
  };

  const preventBackNavigation = () => {
    // Push a new state to the history stack to prevent going back
    window.history.pushState(null, "", window.location.href);

    // Disable back navigation by listening to the popstate event
    window.onpopstate = function () {
      // Every time the user presses the back button, re-push the state
      window.history.pushState(null, "", window.location.href);
    };

    // Also, prevent refresh and navigating away using beforeunload event
    window.onbeforeunload = function () {
      // Display a confirmation message if the user tries to refresh or close
      return;
    };
  };

  useEffect(() => {
    if (login) {
      router.push("/dashboard");
    } else {
      preventBackNavigation();
    }
  }, [login, router]);

  return (
    <div className='bg-white font-montserrat h-screen overflow-y-hidden'>
      <article className='flex h-screen'>
        <section className='w-[50%] text-[#000000] font-[500] flex flex-col text-[32px] justify-center items-center'>
          GATE PASS SYSTEM
        </section>

        <section className='w-[50%] flex flex-col items-center justify-center'>
          <div className='flex justify-center text-black font-montserrat font-[500] mb-20 text-[32px]'>
            LOGIN
          </div>
          <section className='w-[50%] mx-auto flex flex-col gap-1'>
            <input
              name='email'
              value={input.email}
              onChange={handleInputs}
              type='text'
              placeholder='Enter user email'
              className={`input input-bordered w-full text-sm ${
                emailError ? "focus:input-error input-error" : ""
              }`}
              required
            />

            {emailError && (
              <p className='text-sm text-red-600'>
                Please enter a valid email address format
              </p>
            )}

            <label className='label'>
              <span className='label-text'></span>
            </label>
            <div className='relative'>
              <input
                name='password'
                value={input.password}
                type={isPasswordVisible ? "text" : "password"}
                placeholder='Password'
                className='input input-bordered text-sm w-full pr-10'
                required
                onChange={handleInputs}
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute top-1/2 right-2 transform -translate-y-1/2'
              >
                {isPasswordVisible ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    className='w-5 h-5'
                  >
                    <path d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' />
                    <path d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
                  </svg>
                ) : (
                  <svg
                    width='40'
                    height='40'
                    viewBox='0 0 40 40'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5'
                  >
                    <path
                      d='M23.125 31.375C22.0948 31.5698 21.0485 31.6675 20 31.6667C12.5367 31.6667 6.22 26.7617 4.095 20C4.66711 18.1802 5.54832 16.4724 6.7 14.9517M23.5333 23.5333L16.4633 16.465C17.4011 15.5272 18.673 15.0004 19.9992 15.0004C21.3254 15.0004 22.5972 15.5272 23.535 16.465C24.4728 17.4028 24.9996 18.6746 24.9996 20.0008C24.9996 21.327 24.4728 22.5989 23.535 23.5367L29.02 29.02M16.4667 16.4667L10.9833 10.9833M10.9833 10.9833L5 5M10.9833 10.9833C13.6706 9.24928 16.8018 8.32901 20 8.33333C27.4633 8.33333 33.78 13.2383 35.905 20C34.7317 23.7174 32.2956 26.9076 29.0183 29.0183L35 35'
                      stroke='black'
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className='flex justify-between'>
              <div></div>
              <p className='text-[#1795F4] font-[500] cursor-pointer text-[13px]'>
                Forgot Password
              </p>
            </div>
            <section>
              <div className='w-full my-5'>
                <button
                  onClick={implementLogin}
                  disabled={loading || emailError}
                  className={`bg-[#1683CF] text-[14px] ${
                    emailError ? "bg-[#BDBDBD] cursor-not-allowed" : ""
                  } font-[600] border w-full py-3 text-white rounded-lg`}
                >
                  {loading ? (
                    <FaSpinner
                      className='spinner'
                      style={{
                        animation: "spin 1s linear infinite",
                        fontSize: "20px",
                      }}
                    />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
              <div className='flex items-center'>
                <div className='flex-grow h-[1px] bg-[#BDBDBD]'></div>
                <label className='font-[500] text-[15px] mx-2 text-black'>
                  CREATE ACCOUNT
                </label>
                <div className='flex-grow h-[1px] bg-[#BDBDBD]'></div>
              </div>
              <div className='w-full my-5'>
                <button
                  onClick={() => router.push("/registration")}
                  className='bg-[#A5A5A5] font-[600] border w-full text-[14px] py-3 text-white rounded-lg'
                >
                  SIGN UP
                </button>
              </div>
            </section>
          </section>
        </section>
      </article>
      <ToastNotification />
    </div>
  );
};

export default Login;
