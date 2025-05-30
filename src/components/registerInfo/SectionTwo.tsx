import React, { useEffect } from "react";
import { fetchCountries } from "@/utils/helper";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import { completeRegister } from "@/utils/authController";
import {
  setGender,
  setCountry,
  setPhoneNumber,
  selectPhoneNumber,
  selectCountry,
  selectGender,
  selectFirstName,
  selectSecondName,
  selectLastName,
  selectPassword,
  selectEmail,
} from "@/utils/registrationSlice";
import { useSelector } from "react-redux";
import ToastNotification from "../toastNotification/ToastNotification";
import { useRouter } from "next/navigation";

interface Country {
  name: {
    common: string;
  };
}

export const SectionTwo = () => {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const dispatch = useDispatch();
  const firstName = useSelector(selectFirstName);
  const secondName = useSelector(selectSecondName);
  const lastName = useSelector(selectLastName);
  const password = useSelector(selectPassword);
  const email = useSelector(selectEmail);
  const phoneNumber = useSelector(selectPhoneNumber);
  const country = useSelector(selectCountry);
  const gender = useSelector(selectGender);

  const finalizeRegister = async () => {
    try {
      const response = await completeRegister({
        email,
        phoneNumber,
        password,
        gender,
        country,
        lastName,
        secondName,
        firstName,
      });

      if (response.statusText) {
        dispatch(
          // @ts-ignore
          showToast({ message: response?.data.message, type: "success" })
        );
        setTimeout(() => {
          router.push("/");
        }, 4000);
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({ message: err.response?.data?.message, type: "error" })
      );
    }
  };

  return (
    <section className='w-full lg:w-[48%] mx-auto px-4 sm:px-6 lg:px-0 py-6'>
      <div className='bg-white rounded-lg shadow-sm p-6 space-y-6'>
        {/* Email field */}
        <div className='space-y-6'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
            <label className='text-gray-700 font-medium w-full sm:w-32 text-left'>
              Email
            </label>
            <div className='w-full sm:flex-1'>
              <p className='text-gray-600 font-medium'>{email}</p>
            </div>
          </div>

          {/* Gender field */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
            <label className='text-gray-700 font-medium w-full sm:w-32 text-left'>
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => {
                dispatch(setGender(e.target.value));
              }}
              className='select select-bordered w-full sm:flex-1 text-gray-700 bg-white border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500'
            >
              <option value='' className='text-gray-500'>
                Select Gender
              </option>
              <option value='Male' className='text-gray-700'>
                Male
              </option>
              <option value='Female' className='text-gray-700'>
                Female
              </option>
            </select>
          </div>

          {/* Country field */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
            <label className='text-gray-700 font-medium w-full sm:w-32 text-left'>
              Country
            </label>
            <select
              value={country}
              onChange={(e) => {
                dispatch(setCountry(e.target.value));
              }}
              className='select select-bordered w-full sm:flex-1 text-gray-700 bg-white border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500'
            >
              <option value='' className='text-gray-500'>
                Select Country
              </option>
              {fetchCountries.map((country, i) => (
                <option key={i} value={country} className='text-gray-700'>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Phone Number field */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
            <label className='text-gray-700 font-medium w-full sm:w-32 text-left'>
              Phone Number
            </label>
            <div className='w-full sm:flex-1'>
              <input
                value={phoneNumber}
                onChange={(e) => {
                  dispatch(setPhoneNumber(e.target.value));
                }}
                type='tel'
                placeholder='Enter Phone Number'
                className='input input-bordered w-full text-gray-700 bg-white border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500'
                required
              />
            </div>
          </div>

          {/* Register Button */}
          <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8'>
            <div className='w-full sm:w-32'></div>
            <div className='w-full sm:flex-1'>
              <button
                onClick={() => {
                  if (!phoneNumber || !country || !gender) {
                    dispatch(
                      showToast({
                        message: "Please fill in all required fields",
                        type: "error",
                      })
                    );
                    return;
                  }
                  finalizeRegister();
                }}
                className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'
              >
                Register
              </button>
            </div>
          </div>
        </div>
        <ToastNotification />
      </div>
    </section>
  );
};

export default SectionTwo;
