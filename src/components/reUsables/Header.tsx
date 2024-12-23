"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";
interface prop {
  title: any;
  view: any;
}

const Header: React.FC<prop> = ({ title, view }) => {
  const formattedDate = useSelector(
    (state: RootState) => state.date.currentDate
  );

  return (
    <section className='flex lg:mt-4 font-montserrat flex-col sm:flex-row mb-7 items-center justify-between p-4 border-2 border-gray-300 rounded-lg'>
      <h2 className='text-gray-600 font-medium text-base sm:text-lg mb-2 sm:mb-0'>
        {title}
      </h2>

      {view?.toggleView && (
        <p className='text-gray-500 font-semibold text-sm sm:text-base'>
          {formattedDate}
        </p>
      )}

      {title === "Management" && (
        // <button className=' bg-white border border-[#1CA2BB] text-[#37ADC3] rounded-[6px] px-5  text-sm text-[22px] leading-[26px] font-[500] font-inter'>
        //   ADD STUDENT
        // </button>

        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className={`w-7 h-7 ${
            view?.toggleView ? "hidden" : ""
          } cursor-pointer text-blue-500`}
          onClick={() => {
            view?.setToggleView(true);
          }}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z'
          />
        </svg>
      )}
    </section>
  );
};

export default Header;
