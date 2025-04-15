import React from "react";
import Register from "@/components/register/Register";

const page = () => {
  return (
    <div className='flex flex-col lg:flex-row h-screen'>
      <section className='w-full lg:w-[50%] text-black font-[500] flex text-[28px] lg:text-[32px] justify-center items-center py-12 lg:py-0 bg-gradient-to-b from-blue-50 to-white lg:bg-none'>
        <div className='text-center px-4'>GATE PASS SYSTEM</div>
      </section>
      <Register />
    </div>
  );
};

export default page;
