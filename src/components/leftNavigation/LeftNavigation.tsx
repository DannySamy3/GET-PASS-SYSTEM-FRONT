"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Modal from "../LogOutModal.tsx/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronUp,
  faChevronRight, // Use Chevron Right instead of Arrow Right
  faUser, // User icon
} from "@fortawesome/free-solid-svg-icons";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface props {
  isCollapsed: boolean;
  setIsCollapsed: any;
  toggleCollapse: any;
  closeNav: any;
}

const LeftNavigation: React.FC<props> = ({
  isCollapsed,
  setIsCollapsed,
  toggleCollapse,
  closeNav,
}) => {
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState<any>();

  const handleLoggedInuser = () => {
    if (typeof window !== "undefined") {
      const jsonString = localStorage.getItem("user");
      if (jsonString) {
        // Check if jsonString is not null
        try {
          const user = JSON.parse(jsonString);
          setUserData(user);
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }
      } else {
        console.warn("No user data found in localStorage");
      }
    }
  };

  // User data (with user icon as avatar)
  const user = {
    lastName: userData?.lastName,
    avatarIcon: faUser, // FontAwesome user icon
  };
  const handleToggleCollapse = () => {
    toggleCollapse();
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      // Check if the screen width is less than 1024px (small and medium screens)
      closeNav();
    }
  };

  useEffect(() => {
    handleLoggedInuser();
  }, []);

  const router = useRouter();
  return (
    <aside
      className={`lg:fixed lg:top-0 lg:left-0 font-montserrat ${
        isCollapsed ? "lg:w-20" : "lg:w-[300px]"
      } h-screen bg-white text-gray-900 shadow-[0_0_10px_rgba(0,0,0,0.1)] z-50 transition-width duration-300 flex flex-col`}
    >
      <div
        className={`p-4 flex items-center justify-between ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        {showModal && <Modal handleModal={setShowModal} />}

        {/* Logo and University Name */}
        <div
          className={`flex items-center gap-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className={`${isCollapsed ? "w-20" : "w-24"} flex items-center`}>
            <Image
              src='/logo.png'
              alt='GET PASS Logo'
              width={171}
              height={167}
              className='w-full h-full'
              priority
            />
          </div>
          {!isCollapsed && (
            <div className='flex flex-col justify-center'>
              <h1 className='text-lg font-semibold text-[#0066CC]'>
                Dar es Salaam
              </h1>
              <p className='text-sm text-gray-600'>Marine Institute (DMI)</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Links */}
      <nav className='mt-4 flex-grow'>
        <ul
          className={`flex flex-col gap-2 lg:w-auto items-center lg:block lg:mx-0 space-y-1 px-4 ${
            isCollapsed ? "px-2" : ""
          }`}
        >
          <li className='w-full lg:w-auto md:w-auto'>
            <Link
              onClick={handleLinkClick}
              href={"/dashboard"}
              className={`w-full flex justify-center md:justify-stretch lg:justify-stretch items-center gap-4 py-3 px-4 text-base rounded-lg transition-colors duration-200 ${
                isCollapsed ? "justify-center" : ""
              } ${
                pathname === "/dashboard"
                  ? "bg-[#0066CC] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184'
                />
              </svg>

              {!isCollapsed && "Dashboard"}
            </Link>
          </li>
          <li className='w-full lg:w-auto md:w-auto'>
            <Link
              onClick={handleLinkClick}
              href={"/management"}
              className={`w-full flex justify-center md:justify-stretch lg:justify-stretch items-center gap-4 py-3 px-4 text-base rounded-lg transition-colors duration-200 ${
                isCollapsed ? "justify-center" : ""
              } ${
                pathname === "/management"
                  ? "bg-[#0066CC] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                width='18'
                height='19'
                viewBox='0 0 18 19'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M0.599998 2.49998C0.599998 1.86346 0.852855 1.25301 1.30294 0.802919C1.75303 0.352832 2.36348 0.0999756 3 0.0999756H15C15.6365 0.0999756 16.247 0.352832 16.6971 0.802919C17.1471 1.25301 17.4 1.86346 17.4 2.49998V12.1C17.4 12.7365 17.1471 13.3469 16.6971 13.797C16.247 14.2471 15.6365 14.5 15 14.5H12.336L12.4836 15.0868L13.4484 16.0516C13.6162 16.2194 13.7304 16.4332 13.7767 16.6659C13.823 16.8987 13.7992 17.1399 13.7084 17.3592C13.6176 17.5784 13.4638 17.7658 13.2665 17.8977C13.0693 18.0295 12.8373 18.0999 12.6 18.1H5.4C5.1627 18.0999 4.93074 18.0295 4.73345 17.8977C4.53616 17.7658 4.38239 17.5784 4.29159 17.3592C4.20078 17.1399 4.17702 16.8987 4.2233 16.6659C4.26958 16.4332 4.38383 16.2194 4.5516 16.0516L5.5164 15.0868L5.664 14.5H3C2.36348 14.5 1.75303 14.2471 1.30294 13.797C0.852855 13.3469 0.599998 12.7365 0.599998 12.1V2.49998ZM7.5252 10.9H3V2.49998H15V10.9H7.5252Z'
                  fill={pathname === "/management" ? "#FFFFFF" : "#585858"}
                />
              </svg>

              {!isCollapsed && "Management"}
            </Link>
          </li>
          <li className='w-full lg:w-auto md:w-auto'>
            <Link
              onClick={handleLinkClick}
              href={"/sponsors"}
              className={`w-full flex justify-center md:justify-stretch lg:justify-stretch items-center gap-4 py-3 px-4 text-base rounded-lg transition-colors duration-200 ${
                isCollapsed ? "justify-center" : ""
              } ${
                pathname === "/sponsors"
                  ? "bg-[#0066CC] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                width='25'
                height='25'
                viewBox='0 0 25 25'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M11.4583 4.5C11.4583 3.96957 11.6778 3.46086 12.0685 3.08579C12.4592 2.71071 12.9891 2.5 13.5417 2.5C14.0942 2.5 14.6241 2.71071 15.0148 3.08579C15.4055 3.46086 15.625 3.96957 15.625 4.5V5.5C15.625 5.76522 15.7347 6.01957 15.9301 6.20711C16.1254 6.39464 16.3904 6.5 16.6667 6.5H19.7917C20.0679 6.5 20.3329 6.60536 20.5282 6.79289C20.7236 6.98043 20.8333 7.23478 20.8333 7.5V10.5C20.8333 10.7652 20.7236 11.0196 20.5282 11.2071C20.3329 11.3946 20.0679 11.5 19.7917 11.5H18.75C18.1975 11.5 17.6676 11.7107 17.2769 12.0858C16.8862 12.4609 16.6667 12.9696 16.6667 13.5C16.6667 14.0304 16.8862 14.5391 17.2769 14.9142C17.6676 15.2893 18.1975 15.5 18.75 15.5H19.7917C20.0679 15.5 20.3329 15.6054 20.5282 15.7929C20.7236 15.9804 20.8333 16.2348 20.8333 16.5V19.5C20.8333 19.7652 20.7236 20.0196 20.5282 20.2071C20.3329 20.3946 20.0679 20.5 19.7917 20.5H16.6667C16.3904 20.5 16.1254 20.3946 15.9301 20.2071C15.7347 20.0196 15.625 19.7652 15.625 19.5V18.5C15.625 17.9696 15.4055 17.4609 15.0148 17.0858C14.6241 16.7107 14.0942 16.5 13.5417 16.5C12.9891 16.5 12.4592 16.7107 12.0685 17.0858C11.6778 17.4609 11.4583 17.9696 11.4583 18.5V19.5C11.4583 19.7652 11.3486 20.0196 11.1532 20.2071C10.9579 20.3946 10.6929 20.5 10.4167 20.5H7.29167C7.0154 20.5 6.75045 20.3946 6.5551 20.2071C6.35975 20.0196 6.25 19.7652 6.25 19.5V16.5C6.25 16.2348 6.14026 15.9804 5.94491 15.7929C5.74955 15.6054 5.4846 15.5 5.20834 15.5H4.16667C3.61413 15.5 3.08423 15.2893 2.69353 14.9142C2.30283 14.5391 2.08334 14.0304 2.08334 13.5C2.08334 12.9696 2.30283 12.4609 2.69353 12.0858C3.08423 11.7107 3.61413 11.5 4.16667 11.5H5.20834C5.4846 11.5 5.74955 11.3946 5.94491 11.2071C6.14026 11.0196 6.25 10.7652 6.25 10.5V7.5C6.25 7.23478 6.35975 6.98043 6.5551 6.79289C6.75045 6.60536 7.0154 6.5 7.29167 6.5H10.4167C10.6929 6.5 10.9579 6.39464 11.1532 6.20711C11.3486 6.01957 11.4583 5.76522 11.4583 5.5V4.5Z'
                  stroke='#414141'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  fill={pathname === "/sponsors" ? "#FFFFFF" : ""}
                />
              </svg>

              {!isCollapsed && "Sponsors"}
            </Link>
          </li>
          <li className='w-full lg:w-auto md:w-auto'>
            <Link
              onClick={handleLinkClick}
              href={"/course"}
              className={`w-full flex justify-center md:justify-stretch lg:justify-stretch items-center gap-4 py-3 px-4 text-base rounded-lg transition-colors duration-200 ${
                isCollapsed ? "justify-center" : ""
              } ${
                pathname === "/course"
                  ? "bg-[#0066CC] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                width='24'
                height='25'
                viewBox='0 0 24 25'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M19 20.5H5C4.46957 20.5 3.96086 20.2893 3.58579 19.9142C3.21071 19.5391 3 19.0304 3 18.5V6.5C3 5.96957 3.21071 5.46086 3.58579 5.08579C3.96086 4.71071 4.46957 4.5 5 4.5H15C15.5304 4.5 16.0391 4.71071 16.4142 5.08579C16.7893 5.46086 17 5.96957 17 6.5V7.5M19 20.5C18.4696 20.5 17.9609 20.2893 17.5858 19.9142C17.2107 19.5391 17 19.0304 17 18.5V7.5M19 20.5C19.5304 20.5 20.0391 20.2893 20.4142 19.9142C20.7893 19.5391 21 19.0304 21 18.5V9.5C21 8.96957 20.7893 8.46086 20.4142 8.08579C20.0391 7.71071 19.5304 7.5 19 7.5H17M13 4.5H9M7 16.5H13M7 8.5H13V12.5H7V8.5Z'
                  stroke='#414141'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  fill={pathname === "/category" ? "#FFFFFF" : ""}
                />
              </svg>

              {!isCollapsed && "Course"}
            </Link>
          </li>
          <li className='w-full lg:w-auto md:w-auto'>
            <button
              onClick={() => {
                setShowModal(true);
              }}
              className={`w-full text-[##595959] justify-center lg:justify-stretch md:justify-stretch font-[500] leading-[31.69px] flex items-center gap-4 py-3 px-4 text-base rounded-lg hover:bg-gray-50 ${
                isCollapsed ? "text-center" : ""
              } no-underline`}
            >
              <svg
                width='24'
                height='25'
                viewBox='0 0 24 25'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M3 21.5V17.5M3 17.5V5.5C3 4.96957 3.21071 4.46086 3.58579 4.08579C3.96086 3.71071 4.46957 3.5 5 3.5H11.5L12.5 4.5H21L18 10.5L21 16.5H12.5L11.5 15.5H5C4.46957 15.5 3.96086 15.7107 3.58579 16.0858C3.21071 16.4609 3 16.9696 3 17.5ZM12 4V9.5'
                  stroke='#595959'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>

              {!isCollapsed && "Logout"}
            </button>
          </li>
        </ul>
      </nav>

      {/* User section */}
      {!isCollapsed && (
        <div className='flex items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50'>
          <div className='w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-gray-600'
            >
              <path
                fillRule='evenodd'
                d='M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-700'>
              {user.lastName}
            </span>
            <span className='text-xs text-gray-500'>User</span>
          </div>
        </div>
      )}

      <div className='absolute bottom-4 left-1/2 lg:left-auto lg:right-4 lg:transform-none lg:translate-x-0 transform -translate-x-1/2 lg:absolute'>
        <button
          onClick={handleToggleCollapse}
          className='text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200'
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <div className='hidden lg:block'>
            <FontAwesomeIcon
              icon={isCollapsed ? faChevronRight : faChevronLeft}
              className='transition-transform lg:block'
            />
          </div>

          <div className='block lg:hidden'>
            <FontAwesomeIcon
              icon={isCollapsed ? faChevronRight : faChevronUp}
              className={`transition-transform lg:hidden ${
                !isCollapsed ? "swipe-up" : ""
              }`}
            />
          </div>
        </button>
      </div>
    </aside>
  );
};

export default LeftNavigation;
