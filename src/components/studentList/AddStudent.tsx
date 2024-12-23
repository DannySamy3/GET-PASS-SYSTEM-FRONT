import React from "react";

interface props {
  viewer: any;
}

export const AddStudent: React.FC<props> = ({ viewer }) => {
  return (
    <div className=' overflow-y-hidden '>
      {/* <div className=' flex justify-end my-0 w-full   mb-5 '>
        <button
          // onClick={viewer(false)}
          className='btn rounded-[8px] w-[8%] mr-2 btn-error bg-[#FB5959] text-white hover:text-white   border border-[#FB5959] '
        >
          Cancel
        </button>
      </div> */}
      <section className=' my-4 bg-gray-50    border overflow-y-hidden  font-montserrat    rounded-[12px] w-full '>
        {/* <section className=''>
          <div className=' flex  mb-1 '>
            <span className=' text-[#475053]  text-xl font-[500]'>
              ADD STUDENT
            </span>
          </div>
        </section> */}

        <div className=' flex justify-end my-0 w-full mt-2 mb-6 px-3   '>
          <button
            onClick={() => viewer(false)}
            className=' rounded-full flex items-center justify-center  h-8 w-8 bg-[#FB5959] text-white text-[15px] hover:text-white   '
          >
            x
          </button>
        </div>
        <section className='  flex px-12   flex-col my-3 gap-y-[13px]'>
          <label className=' text-sm text-[#414141]  font-[500]'>
            First Name
          </label>
          <input
            type='text'
            placeholder="Enter student's first name"
            className='  border input input-md text-[#414141] border-[#D9CBCB] rounded-[8px] h-[34px] '
          />
          <label className=' text-sm text-[#414141]  font-[500]'>
            Second Name
          </label>
          <input
            type='text'
            placeholder="Enter student's middle name"
            className='  border input input-md text-[#414141] border-[#D9CBCB] rounded-[8px] h-[34px] '
          />
          <label className=' text-sm text-[#414141] font-[500]'>SurName</label>
          <input
            type='text'
            placeholder="Enter student's last name"
            className=' border input input-md text-[#414141] border-[#D9CBCB] rounded-[8px] h-[34px] '
          />
          <label className=' text-sm text-[#414141]  font-[500]'>
            Nationality
          </label>
          <select className=' select  select-sm border border-[#D9CBCB]  h-[34px]'>
            <option value=''>Select Country</option>
          </select>
          <label className=' text-sm text-[#414141] font-[500]'> Gender</label>
          <select className=' select  select-sm border border-[#D9CBCB]  h-[34px]'>
            <option value=''>Female</option>
            <option value=''>Male</option>
          </select>

          <label className=' text-sm text-[#414141]  font-[500]'>
            Phone Number
          </label>
          <input
            type='text'
            placeholder='Enter an active mobile number'
            className=' border input text-[#414141] input-md border-[#D9CBCB] rounded-[8px] h-[34px] '
          />
          <label className=' text-sm text-[#414141]  font-[500]'> Class</label>
          <select className=' select  select-sm border border-[#D9CBCB]  h-[34px]'>
            <option value=''>Select Class</option>
          </select>
          <label className=' text-sm text-[#414141]  font-[500]'>
            {" "}
            Sponsor
          </label>
          <select className=' select  select-sm border border-[#D9CBCB]  h-[34px]'>
            <option value=''>Select Sponsor</option>
          </select>
        </section>

        <div className=' flex my-5 justify-end w-full'>
          <button className='  btn rounded-[8px]   border bg-[#3A7563] text-white w-[15%] mx-auto   hover:text-white btn-success  '>
            Register
          </button>
          {/* <button
            // onClick={viewer(false)}
            className='btn rounded-[8px] btn-error hover:text-white   border border-[#FB5959] text-[#FB5959] bg-white'
          >
            Cancel
          </button> */}
        </div>
      </section>
    </div>
  );
};
