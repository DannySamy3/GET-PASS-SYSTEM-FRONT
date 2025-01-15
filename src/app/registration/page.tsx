import React from "react";
import Register from "@/components/register/Register";

const page = () => {
  return (
    <div className=' flex h-screen '>
      <section className=' w-[50%] font-[500] flex text-[32px] justify-center items-center'>
        GATE PASS SYSTEM
      </section>
      <Register />
    </div>
  );
};

export default page;
