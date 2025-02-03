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
      <article className='flex flex-col mt-9'>
        <section className='font-[500] text-black mt-20 ml-44 mb-[95px] flex items-center text-3xl justify-center'>
          CREATE ACCOUNT
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
