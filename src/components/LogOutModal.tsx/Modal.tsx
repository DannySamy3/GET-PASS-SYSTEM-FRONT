import React from "react";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/utils/store";
import { logout } from "../../utils/authenticatorSlice";

const Modal: React.FC<any> = ({ handleModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    handleModal(false);
    dispatch(logout());
  };
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center font-montserrat'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black bg-opacity-50' />

      {/* Modal */}
      <div className='relative w-[420px] h-[368px] p-6 bg-white rounded-2xl shadow-2xl border border-gray-200 flex-col justify-center items-center gap-4 inline-flex overflow-hidden'>
        <div className='w-10 h-10 relative overflow-hidden'>
          <svg
            width='40'
            height='40'
            viewBox='0 0 40 40'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='fi:alert-triangle'>
              <path
                id='Vector'
                d='M17.1503 6.43331L3.03361 30C2.74256 30.504 2.58856 31.0755 2.58693 31.6575C2.5853 32.2395 2.7361 32.8119 3.02432 33.3175C3.31255 33.8232 3.72815 34.2446 4.22979 34.5397C4.73143 34.8349 5.30161 34.9936 5.88361 35H34.1169C34.6989 34.9936 35.2691 34.8349 35.7708 34.5397C36.2724 34.2446 36.688 33.8232 36.9762 33.3175C37.2645 32.8119 37.4153 32.2395 37.4136 31.6575C37.412 31.0755 37.258 30.504 36.9669 30L22.8503 6.43331C22.5532 5.94349 22.1348 5.53851 21.6356 5.25745C21.1364 4.97639 20.5732 4.82874 20.0003 4.82874C19.4274 4.82874 18.8642 4.97639 18.365 5.25745C17.8657 5.53851 17.4474 5.94349 17.1503 6.43331V6.43331Z'
                stroke='#EF4444'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                id='Vector_2'
                d='M20 15V21.6667'
                stroke='#EF4444'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                id='Vector_3'
                d='M20 28.3333H20.0167'
                stroke='#EF4444'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </g>
          </svg>
        </div>
        <div className='self-stretch h-[136px] flex-col justify-center items-center gap-2 flex'>
          <div className='text-gray-800 text- xl font-semibold  leading-loose'>
            Logout
          </div>
          <div className='self-stretch text-gray-700 text-base font-normal text-center  leading-normal'>
            You're about to Sign Out !
          </div>
        </div>
        <div className='self-stretch h-28 flex-col justify-start items-start gap-2 flex'>
          <div className='self-stretch h-[52px] flex-col justify-start items-start gap-2 flex'>
            <div className='self-stretch h-[52px] flex-col justify-start items-center gap-4 flex'>
              <div
                onClick={handleLogout}
                className='self-stretch cursor-pointer px-4 py-3.5 bg-red-500 rounded-lg justify-center items-center gap-2 inline-flex'
              >
                <div className='justify-start items-center gap-2 flex'>
                  <div className='text-white text-base font-semibold  leading-normal'>
                    Proceed
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            // onClick={() => handleView(false)}
            className='self-stretch cursor-pointer h-[52px] flex-col justify-start items-center gap-4 flex'
          >
            <div className='self-stretch px-4 py-3.5 bg-gray-100 rounded-lg border border-gray-100 justify-center items-center gap-2 inline-flex'>
              <div
                onClick={() => handleModal(false)}
                className='text-gray-800 text-base font-normal  leading-normal'
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
