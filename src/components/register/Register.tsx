import React from "react";
interface props {
  handleInputs: any;
  emailError: any;
  input: any;
}

export const Register: React.FC<props> = ({
  emailError,
  handleInputs,
  input,
}) => {
  return (
    <div className=' font-montserrat w-[50%] mt-64 '>
      <h2 className=' flex justify-center text-black font-montserrat font-[500] mb-6 text-[32px]'>
        CREATE ACCOUNT
      </h2>
      <p className=' w-[50%] mx-auto  font-[500] text-[#292727] text-[14px] mb-8'>
        Please enter the email address you wish to use for registration.
        Verification Code Will be Sent to it
      </p>
      <section className=' w-[50%] mx-auto  flex flex-col gap-3  '>
        <input
          name='email'
          // value={input.password}
          placeholder='Enter your email address'
          className={`input input-bordered w-full text-sm ${
            emailError ? " focus:input-error" : ""
          }`}
          required
          onChange={(e: any) => handleInputs(e)}
        />
        {emailError && (
          <p className=' text-sm text-red-600 '>
            Please enter a valid email address format
          </p>
        )}
        {/* <div className=' flex justify-between'>
          <div></div>
          <p className=' text-[#1795F4] font-[500] cursor-pointer text-[13px]'>
            resend code
          </p>
        </div> */}
        <div className=' w-full my-7'>
          <button className=' bg-[#1683CF] text-[14px] font-[600] border w-full py-3 text-white rounded-lg'>
            Send Code
          </button>
        </div>
      </section>
    </div>
  );
};
