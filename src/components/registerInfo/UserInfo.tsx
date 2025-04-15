"use client";
import React, { useEffect, useState } from "react";
import { SectionOne } from "./SectionOne";
import { SectionTwo } from "./SectionTwo";

export const UserInfo = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState({
    pass: false,
    rePass: false,
  });
  const [isSectionOne, setIsSectionOne] = useState(true);

  const togglePasswordVisibility = (name: string) => {
    setIsPasswordVisible((prev: any) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className='bg-white h-screen overflow-y-hidden'>
      <article className='flex flex-col mt-4 lg:mt-9'>
        <section className='font-[500] text-black mt-8 lg:mt-20 ml-4 lg:ml-44 mb-8 lg:mb-[95px] flex items-center text-xl lg:text-3xl justify-center bg-gradient-to-b from-blue-50 to-white lg:bg-none py-8 lg:py-0'>
          <div className='text-center'>CREATE ACCOUNT</div>
        </section>

        {isSectionOne && (
          <SectionOne
            isPasswordVisible={isPasswordVisible}
            togglePasswordVisibility={togglePasswordVisibility}
            setIsSectionOne={setIsSectionOne}
          />
        )}

        {!isSectionOne && <SectionTwo />}
      </article>
    </div>
  );
};
