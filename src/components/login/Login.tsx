import React from "react";

const Login = () => {
  return (
    <div className=' bg-white p- rounded-xl font-montserrat h-screen  overflow-y-hidden'>
      <article className=' flex h-full'>
        <section className=' w-[50%] font-[500] flex text-[32px] justify-center items-center'>
          GATE PASS SYSTEM
        </section>
        <section className=' w-[50%] mt-40 '>
          <div className=' flex justify-center text-black font-montserrat font-[500] mb-20 text-[32px]'>
            LOGIN
          </div>
          <section className=' w-[50%] mx-auto  flex flex-col gap-4  '>
            <input
              type='text'
              placeholder='Enter user email'
              className='input input-bordered w-full text-sm '
            />

            <label className='input input-bordered flex items-center gap-2'>
              <input
                type='password'
                className='grow text-sm'
                placeholder='Password '
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 16 16'
                fill='currentColor'
                className='h-5 w-5 opacity-70 cursor-pointer'
              >
                <path
                  fillRule='evenodd'
                  d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                  clipRule='evenodd'
                />
              </svg>
            </label>

            <div className=' flex justify-between'>
              <div></div>
              <p className=' text-[#1795F4] font-[500] cursor-pointer text-[13px]'>
                Forgot Password
              </p>
            </div>
            <section>
              <div className=' w-full my-7'>
                <button className=' bg-[#1683CF] text-[14px] font-[600] border w-full py-3 text-white rounded-lg'>
                  LOGIN
                </button>
              </div>
              <div className='flex items-center'>
                <div className='flex-grow h-[1px] bg-[#BDBDBD]'></div>
                <label className='font-[500] text-[15px] mx-2'>
                  CREATE ACCOUNT
                </label>
                <div className='flex-grow h-[1px] bg-[#BDBDBD]'></div>
              </div>
              <div className=' w-full my-6'>
                <button className=' bg-[#A5A5A5] font-[600] border w-full text-[14px] py-3 text-white rounded-lg'>
                  SIGN UP
                </button>
              </div>
            </section>
          </section>
        </section>
      </article>
    </div>
  );
};

export default Login;
