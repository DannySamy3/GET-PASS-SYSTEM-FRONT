import VerifyToken from "@/components/verifyToken/VerifyToken";
import React from "react";

const page = () => {
  return (
    <div className=' flex h-screen '>
      <section className=' w-[50%] font-[500] flex text-[32px] justify-center items-center'>
        GATE PASS SYSTEM
      </section>
      <VerifyToken />
    </div>
  );
};

export default page;