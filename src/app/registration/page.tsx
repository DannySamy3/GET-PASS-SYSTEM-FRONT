import React from "react";
import Register from "@/components/register/Register";

const page = () => {
  console.log("oooooooooooooooooooooooooooooook");
  return (
    <div className=' bg-white p- rounded-xl font-montserrat h-screen  overflow-y-hidden'>
      <article className=' flex h-full'>
        <section className=' w-[50%] font-[500] flex text-[32px] justify-center items-center'>
          GATE PASS SYSTEM
        </section>
        <Register />
      </article>
    </div>
  );
};

export default page;
