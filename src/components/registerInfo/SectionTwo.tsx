import React from "react";

export const SectionTwo = () => {
  return (
    <section className='w-[98%] mx-auto grid grid-cols-[0.18fr_0.4fr] items-center justify-center gap-y-6'>
      <label className='text-[#292727] font-[500]'>Email</label>
      <label>danielntunduye@gmail.com</label>

      <label className='text-[#292727] font-[500]'>Gender</label>
      <select className='select select-bordered'>
        <option>Select Gender</option>
      </select>

      <label className='text-[#292727] font-[500]'>Country</label>
      <select className='select select-bordered'>
        <option>Select Country</option>
      </select>

      <label className='text-[#292727] font-[500]'>Phone Number</label>
      <div className='relative'>
        <input
          name='password'
          placeholder='Password'
          className='input input-bordered text-sm w-full pr-10'
          required
        />
      </div>

      <div className='w-[100%] my-3 col-start-2'>
        <button className='bg-[#4CAF50] text-[14px] font-[600] border w-full py-3 text-white rounded-lg'>
          Register
        </button>
      </div>
    </section>
  );
};

export default SectionTwo;
