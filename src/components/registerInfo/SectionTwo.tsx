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
          showToast({ message: response?.data.message, type: "success" })
        );
        setTimeout(() => {
          router.push("/");
        }, 4000); // Delay navigation for 3 seconds
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({ message: err.response?.data?.message, type: "error" })
      );
    }
  };

  const phoneNumber = useSelector(selectPhoneNumber);
  const country = useSelector(selectCountry);
  const gender = useSelector(selectGender);

  return (
    <section className='w-[98%] mx-auto grid grid-cols-[0.18fr_0.4fr] items-center justify-center gap-y-6'>
      <label className='text-[#515253] font-[500]'>Email</label>
      <label className=' text-[#515253] font-[500]'>
        danielntunduye@gmail.com
      </label>

      <label className='text-[#515253] font-[500]'>Gender</label>
      <select
        value={gender}
        onChange={(e) => {
          dispatch(setGender(e.target.value));
        }}
        className='select select-bordered text-[#515253] font-[500]'
      >
        <option value='' className='text-[#515253] '>
          Select Gender
        </option>
        <option className='text-[#515253] ' value='Male'>
          Male
        </option>
        <option value='Female'>Female</option>
      </select>

      <label className='text-[#515253] font-[500]'>Country</label>
      <select
        value={country}
        onChange={(e) => {
          dispatch(setCountry(e.target.value));
        }}
        className='select select-bordered text-[#515253] font-[500]'
      >
        <option value=''>Select Country</option>
        {fetchCountries.map((country, i) => (
          <option key={i} value={country}>
            {country}
          </option>
        ))}
      </select>

      <label className='text-[#515253] font-[500]'>Phone Number</label>
      <div className='relative'>
        <input
          value={phoneNumber}
          onChange={(e) => {
            dispatch(setPhoneNumber(e.target.value));
          }}
          name='text'
          placeholder=' Enter Phone Number'
          className='input input-bordered text-sm w-full pr-10 text-[#515253]font-[500]'
          required
        />
      </div>

      <div className='w-[100%] my-3 col-start-2'>
        <button
          onClick={() => {
            if (!phoneNumber || !country || !gender) {
              dispatch(
                showToast({
                  message: "Missing input(s)",
                  type: "error",
                })
              );
              return;
            }
            finalizeRegister();
          }}
          className='bg-[#4CAF50] text-[14px] font-[600] border w-full py-3 text-white rounded-lg'
        >
          Register
        </button>
      </div>
      <ToastNotification />
    </section>
  );
};

export default SectionTwo;
