import React from "react";

interface props {
  togglePasswordVisibility: any;
  isPasswordVisible: any;
  setIsSectionOne: any;
}

export const SectionOne: React.FC<props> = ({
  togglePasswordVisibility,
  isPasswordVisible,
  setIsSectionOne,
}) => {
  return (
    <section className=' w-[98%] mx-auto   grid grid-cols-[0.18fr_0.4fr] items-center justify-center gap-y-6'>
      <label className=' text-[#292727] font-[500]'>First Name</label>
      <input
        name='firstName'
        //   value={input.email}
        //   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputs(e)}
        type='text'
        placeholder='Enter First Name'
        className={`input input-bordered  text-sm w-full`}
        required
      />
      <label className=' text-[#292727] font-[500]'>Mid Name</label>
      <input
        name='secondName'
        //   value={input.email}
        //   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputs(e)}
        type='text'
        placeholder='Second Name'
        className={`input input-bordered w-full text-sm `}
        required
      />
      <label className=' text-[#292727] font-[500]'>Last Name</label>
      <input
        name='lastName'
        //   value={input.email}
        //   onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputs(e)}
        type='text'
        placeholder='Last Name'
        className={`input input-bordered w-full text-sm `}
        required
      />
      <label className=' text-[#292727] font-[500]'>Password</label>
      <div className='relative'>
        <input
          name='password'
          // value={input.password}
          type={isPasswordVisible.pass ? "text" : "password"}
          placeholder='Password'
          className='input input-bordered text-sm w-full pr-10'
          required
          // onChange={(e: any) => handleInputs(e)}
        />
        <button
          type='button'
          onClick={() => togglePasswordVisibility("pass")}
          className='absolute top-1/2 right-2 transform -translate-y-1/2'
        >
          {isPasswordVisible.pass ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              // strokeWidth={1.5}
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path
                //   strokeLinecap='round'
                //   strokeLinejoin='round'
                d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
              />
              <path
                //   strokeLinecap='round'
                //   strokeLinejoin='round'
                d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
              />
            </svg>
          ) : (
            <svg
              width='40'
              height='40'
              viewBox='0 0 40 40'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className=' h-5 w-5'
            >
              <path
                d='M23.125 31.375C22.0948 31.5698 21.0485 31.6675 20 31.6667C12.5367 31.6667 6.22 26.7617 4.095 20C4.66711 18.1802 5.54832 16.4724 6.7 14.9517M23.5333 23.5333L16.4633 16.465C17.4011 15.5272 18.673 15.0004 19.9992 15.0004C21.3254 15.0004 22.5972 15.5272 23.535 16.465C24.4728 17.4028 24.9996 18.6746 24.9996 20.0008C24.9996 21.327 24.4728 22.5989 23.535 23.5367L29.02 29.02M16.4667 16.4667L10.9833 10.9833M10.9833 10.9833L5 5M10.9833 10.9833C13.6706 9.24928 16.8018 8.32901 20 8.33333C27.4633 8.33333 33.78 13.2383 35.905 20C34.7317 23.7174 32.2956 26.9076 29.0183 29.0183L35 35'
                stroke='black'
                //   stroke-width='2'
                //   stroke-linecap='round'
                //   stroke-linejoin='round'
              />
            </svg>
          )}
        </button>
      </div>
      <label className=' text-[#292727] font-[500]'>Confirm Password</label>
      <div className='relative'>
        <input
          name='password'
          // value={input.password}
          type={isPasswordVisible.rePass ? "text" : "password"}
          placeholder='Re-Enter the Password'
          className='input input-bordered text-sm w-full pr-10'
          required
          // onChange={(e: any) => handleInputs(e)}
        />
        <button
          type='button'
          onClick={() => togglePasswordVisibility("rePass")}
          className='absolute top-1/2 right-2 transform -translate-y-1/2'
        >
          {isPasswordVisible.rePass ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              // strokeWidth={1.5}
              stroke='currentColor'
              className='w-5 h-5'
            >
              <path
                //   strokeLinecap='round'
                //   strokeLinejoin='round'
                d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
              />
              <path
                //   strokeLinecap='round'
                //   strokeLinejoin='round'
                d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
              />
            </svg>
          ) : (
            <svg
              width='40'
              height='40'
              viewBox='0 0 40 40'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className=' h-5 w-5'
            >
              <path
                d='M23.125 31.375C22.0948 31.5698 21.0485 31.6675 20 31.6667C12.5367 31.6667 6.22 26.7617 4.095 20C4.66711 18.1802 5.54832 16.4724 6.7 14.9517M23.5333 23.5333L16.4633 16.465C17.4011 15.5272 18.673 15.0004 19.9992 15.0004C21.3254 15.0004 22.5972 15.5272 23.535 16.465C24.4728 17.4028 24.9996 18.6746 24.9996 20.0008C24.9996 21.327 24.4728 22.5989 23.535 23.5367L29.02 29.02M16.4667 16.4667L10.9833 10.9833M10.9833 10.9833L5 5M10.9833 10.9833C13.6706 9.24928 16.8018 8.32901 20 8.33333C27.4633 8.33333 33.78 13.2383 35.905 20C34.7317 23.7174 32.2956 26.9076 29.0183 29.0183L35 35'
                stroke='black'
                //   stroke-width='2'
                //   stroke-linecap='round'
                //   stroke-linejoin='round'
              />
            </svg>
          )}
        </button>
      </div>
      <div className=' w-[100%] my-3 col-start-2'>
        <button
          onClick={() => setIsSectionOne(false)}
          className=' bg-[#1683CF] text-[14px] font-[600] border w-full py-3 text-white rounded-lg'
        >
          Next
        </button>
      </div>
    </section>
  );
};
