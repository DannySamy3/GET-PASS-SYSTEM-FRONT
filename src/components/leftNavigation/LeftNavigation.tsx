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

        {/* Logo */}
        <div className={`${isCollapsed ? "w-12" : "w-16"} mb-4`}>
          <svg
            version='1.0'
            width='131pt'
            height='126.70727pt'
            viewBox='0 0 131 126.70727'
            preserveAspectRatio='xMidYMid meet'
            className='w-full h-full'
          >
            <g
              transform='matrix(0.1,0,0,-0.1,-9.5,137.87639)'
              fill='#000000'
              stroke='none'
            >
              <path d='m 760,1332 c 0,-45 -3,-50 -25,-56 -14,-4 -25,-11 -25,-16 0,-5 -17,-12 -37,-15 -57,-10 -133,-35 -183,-60 -25,-13 -61,-26 -81,-29 -34,-6 -38,-4 -58,29 -13,23 -27,35 -38,33 -28,-5 -26,-27 7,-60 27,-26 30,-35 21,-50 -6,-10 -11,-26 -11,-37 0,-10 -15,-44 -34,-74 -18,-31 -39,-78 -46,-104 -8,-26 -22,-54 -32,-61 -10,-7 -18,-24 -18,-38 0,-22 -4,-24 -50,-24 -31,0 -50,4 -50,11 0,8 15,10 47,6 36,-5 43,-4 30,4 -25,15 -82,7 -82,-11 0,-11 14,-16 53,-18 40,-2 52,-7 52,-19 0,-9 7,-25 16,-34 10,-11 18,-40 19,-71 2,-30 12,-70 24,-93 12,-21 21,-35 21,-30 0,6 13,-9 28,-32 36,-55 34,-88 -8,-123 -23,-18 -31,-32 -27,-44 10,-26 34,-19 62,18 30,40 34,39 170,-25 44,-21 98,-41 120,-45 22,-4 48,-15 58,-25 10,-11 22,-19 28,-19 6,0 7,-19 3,-49 -7,-54 7,-74 33,-48 13,12 13,22 5,54 -10,35 -11,36 -10,8 1,-59 -2,-69 -12,-59 -7,7 -8,28 -4,52 6,36 10,42 31,42 13,0 36,9 51,19 15,11 45,22 67,26 22,3 72,21 110,39 39,19 86,36 105,40 32,5 37,3 58,-30 14,-21 30,-34 39,-32 30,6 25,28 -13,63 -33,30 -36,36 -23,52 7,10 -3,3 -23,-16 -24,-21 -42,-31 -53,-27 -9,3 -33,-5 -55,-19 -199,-126 -485,-85 -651,92 -33,36 -58,70 -56,76 2,6 19,16 38,22 33,11 35,10 64,-26 44,-54 85,-85 159,-120 165,-77 373,-36 499,100 53,58 54,58 85,45 18,-7 32,-18 32,-23 0,-6 -28,-40 -61,-76 -34,-36 -57,-65 -52,-65 10,0 87,78 113,116 8,11 23,23 33,27 10,4 17,12 15,19 -1,7 4,24 11,37 7,13 15,49 17,79 3,31 11,63 19,72 8,9 15,22 15,29 0,9 16,11 53,9 46,-3 52,-1 52,17 0,16 -7,20 -38,21 l -37,1 35,-4 c 52,-6 42,-23 -14,-23 -45,0 -48,2 -48,26 0,14 -10,35 -22,48 -11,12 -21,29 -21,37 0,17 -56,138 -74,159 -7,8 -16,30 -19,47 -6,29 -2,36 28,59 38,29 45,51 18,61 -11,4 -26,-5 -48,-32 -21,-24 -35,-33 -39,-26 -4,6 -11,11 -16,11 -5,0 5,-13 21,-29 46,-47 34,-60 -13,-14 -51,48 -131,95 -208,119 -30,10 -68,27 -83,38 -25,18 -28,26 -25,66 2,40 0,45 -20,48 -20,3 -22,-1 -22,-46 z m 30,-7 c 0,-25 -4,-45 -10,-45 -5,0 -10,20 -10,45 0,25 5,45 10,45 6,0 10,-20 10,-45 z m 24,-61 c 32,-12 15,-19 -39,-16 -30,2 -53,8 -49,13 6,10 64,12 88,3 z m 54,-39 c 93,-22 168,-63 240,-129 72,-68 106,-121 133,-207 20,-65 26,-212 9,-239 -5,-9 -5,-19 2,-27 8,-10 6,-13 -6,-13 -10,0 -14,5 -11,10 3,6 2,10 -3,10 -20,0 -20,-14 1,-31 12,-11 18,-19 12,-18 -23,3 -27,-2 -14,-18 10,-11 10,-14 2,-9 -8,4 -13,2 -13,-4 0,-6 -5,-8 -11,-4 -8,4 -7,9 2,16 9,5 4,6 -15,2 -21,-5 -27,-4 -22,5 4,6 16,11 27,11 10,0 19,4 19,9 0,5 -10,7 -22,4 -19,-5 -21,-3 -10,8 20,22 15,41 -9,34 -15,-5 -19,-4 -14,4 4,7 21,9 43,6 l 37,-5 -33,13 -33,12 -2,90 c -3,118 -30,185 -104,265 -220,238 -623,157 -728,-146 -10,-28 -18,-86 -19,-136 -2,-54 -8,-93 -16,-103 -7,-8 -15,-13 -18,-10 -3,2 1,12 9,22 15,18 16,18 -32,-2 -21,-8 -29,20 -29,105 1,129 40,228 132,326 66,71 70,84 8,28 -25,-23 -40,-31 -40,-22 0,23 49,63 78,63 15,1 56,16 91,34 113,58 240,74 359,46 z m -524,-49 c 37,-49 32,-56 -9,-16 -19,19 -35,38 -35,42 0,18 19,6 44,-26 z m 876,5 c 0,-10 -64,-61 -76,-61 -4,0 7,16 26,35 34,35 50,43 50,26 z m -371,-42 c 161,-37 296,-178 317,-332 l 7,-47 h -42 c -41,0 -41,0 -41,38 0,20 -7,46 -15,56 -8,11 -15,14 -15,8 0,-7 -7,-12 -16,-12 -13,0 -15,7 -9,36 4,24 3,34 -4,29 -6,-3 -11,2 -11,11 0,14 3,15 12,6 16,-16 51,-16 45,1 -2,6 -14,11 -26,9 -15,-2 -24,4 -30,20 -6,13 -10,17 -10,11 -1,-18 -28,-16 -35,3 -3,9 -6,34 -6,56 0,51 -13,43 -14,-8 -1,-23 -7,-39 -15,-42 -10,-3 -12,0 -8,12 5,12 3,16 -5,13 -7,-2 -12,-12 -10,-22 2,-10 -1,-14 -7,-10 -7,3 -11,-3 -11,-15 0,-19 -4,-21 -25,-16 -19,5 -25,2 -25,-10 0,-12 7,-15 25,-12 18,4 23,2 16,-6 -6,-7 -8,-21 -5,-33 7,-24 -14,-42 -26,-23 -10,15 -30,-18 -30,-49 0,-36 -10,-48 -36,-43 -13,2 -26,8 -29,12 -2,4 5,51 16,103 19,89 20,99 5,128 -9,18 -16,39 -17,48 0,12 -3,11 -8,-4 -5,-11 -7,-33 -4,-50 2,-16 0,-48 -6,-70 -10,-38 -10,-37 -8,23 2,34 2,62 0,62 -1,0 -7,-8 -12,-18 -7,-13 -5,-49 5,-112 8,-51 13,-99 10,-106 -7,-19 -46,-18 -46,1 0,11 -16,15 -67,17 -55,2 -68,6 -71,20 -2,11 2,16 10,14 7,-2 32,-7 55,-10 l 43,-6 -26,37 c -30,45 -27,79 12,131 l 27,34 -43,-7 c -24,-4 -58,-13 -76,-21 -30,-12 -34,-12 -43,4 -9,15 -10,15 -11,-4 0,-12 -17,-33 -44,-53 -25,-19 -59,-54 -77,-78 l -32,-45 42,7 c 39,6 41,6 41,-19 0,-14 -3,-26 -7,-27 -5,-1 -22,-2 -40,-3 -18,-1 -35,-5 -39,-9 -4,-4 80,-8 187,-9 107,-1 214,-2 239,-3 25,-1 123,-3 218,-4 l 172,-1 v -35 c 0,-23 -6,-38 -16,-42 -24,-9 -37,-52 -22,-71 10,-12 10,-14 1,-8 -7,4 -13,4 -14,-1 -7,-82 -95,-169 -219,-217 -109,-43 -261,-28 -369,37 -59,36 -131,111 -131,137 0,10 -7,23 -15,30 -8,6 -14,15 -13,18 0,4 0,9 -2,12 -1,3 -4,16 -6,30 -2,13 -9,27 -15,31 -7,4 -10,39 -7,95 3,70 9,101 29,144 83,175 288,273 478,229 z M 783,951 c -7,-44 -21,-63 -17,-24 1,15 3,42 3,58 1,22 4,26 10,16 5,-8 7,-30 4,-50 z m -154,12 c -23,-45 -23,-59 -5,-96 l 15,-27 -82,6 c -45,3 -102,1 -127,-4 -24,-6 -46,-9 -48,-7 -7,6 63,77 105,106 47,33 106,57 139,58 l 22,1 z m 374,-22 c 4,-1 7,-14 7,-30 0,-33 -23,-47 -40,-25 -10,11 -10,14 0,14 10,0 10,3 0,15 -15,18 -22,14 -24,-17 -1,-15 -7,-22 -16,-20 -10,2 -11,0 -5,-6 6,-5 43,-15 83,-22 50,-9 69,-17 62,-24 -14,-14 -13,-43 3,-49 6,-2 9,-7 6,-11 -4,-4 -28,-2 -54,4 -28,6 -77,8 -115,4 l -66,-6 4,36 c 4,31 8,36 37,42 27,5 32,10 27,26 -3,11 1,24 9,29 10,6 10,9 2,9 -15,0 -17,27 -3,32 8,2 51,2 83,-1 z M 548,821 c 4,-11 -5,-12 -44,-7 -36,4 -43,3 -26,-4 12,-5 65,-13 117,-16 112,-8 127,-24 23,-23 -69,1 -191,15 -158,18 12,1 12,3 2,9 -7,5 -10,16 -6,26 5,13 16,16 47,14 23,-2 42,-9 45,-17 z M 230,769 c 0,-37 -4,-58 -10,-54 -16,10 -11,115 6,115 2,0 4,-27 4,-61 z m 1060,1 c 0,-27 -4,-52 -10,-55 -6,-4 -10,17 -10,55 0,38 4,59 10,55 6,-3 10,-28 10,-55 z M 330,616 c 0,-8 -13,-21 -30,-30 -25,-12 -30,-12 -30,-1 0,11 26,30 58,44 1,1 2,-5 2,-13 z m 33,-27 c -4,-16 -8,-17 -14,-7 -7,10 -9,9 -9,-4 0,-10 -4,-18 -10,-18 -5,0 -10,6 -10,13 0,11 15,22 47,36 0,1 -1,-8 -4,-20 z m 21,-34 c -4,-8 -10,-15 -14,-15 -5,0 -16,-3 -26,-7 -12,-4 -15,-2 -12,8 2,7 15,16 29,20 13,4 25,7 26,8 1,1 0,-6 -3,-14 z m 816,-20 c 7,-8 16,-12 21,-9 5,3 9,1 9,-5 0,-5 -9,-9 -20,-8 -11,1 -20,5 -20,9 0,4 -7,8 -16,8 -8,0 -12,5 -9,10 9,14 21,12 35,-5 z M 408,362 c -13,-6 -68,39 -68,55 0,11 12,5 38,-18 21,-19 34,-35 30,-37 z m -82,-20 c -19,-20 -39,-33 -43,-28 -9,9 58,74 71,68 4,-3 -8,-21 -28,-40 z m 843,-6 c 18,-19 28,-36 23,-40 -6,-3 -25,12 -42,34 -39,49 -26,53 19,6 z M 795,240 c -3,-5 -26,-10 -50,-10 -24,0 -47,5 -50,10 -4,6 15,10 50,10 35,0 54,-4 50,-10 z' />
              <path d='m 560,1165 c 0,-17 10,-24 26,-18 21,8 17,32 -6,30 -11,-1 -20,-6 -20,-12 z' />
              <path d='m 331,988 c -11,-17 -10,-22 1,-29 28,-18 38,-4 16,20 -11,11 -10,13 5,8 20,-7 24,8 4,16 -7,3 -19,-4 -26,-15 z' />
              <path d='m 700,720 c 0,-11 7,-20 15,-20 8,0 15,9 15,20 0,11 -7,20 -15,20 -8,0 -15,-9 -15,-20 z' />
              <path d='m 719,644 c -11,-14 -11,-21 3,-45 17,-29 17,-29 -10,-29 -32,0 -52,-16 -52,-41 0,-10 -9,-19 -22,-21 -13,-3 1,-5 29,-6 43,-1 55,3 68,21 l 15,21 23,-22 c 30,-28 53,-28 68,0 10,18 8,24 -11,40 -12,10 -26,15 -32,12 -18,-11 -59,7 -67,29 -11,30 -3,47 21,47 18,0 20,-5 15,-37 -6,-35 -5,-36 8,-19 18,24 19,38 3,54 -17,17 -43,15 -59,-4 z m 21,-92 c 0,-17 -39,-44 -55,-39 -18,8 -20,33 -2,40 20,9 57,8 57,-1 z m 88,-14 c -4,-31 -19,-32 -52,-3 l -29,25 h 42 c 38,0 42,-2 39,-22 z' />
            </g>
          </svg>
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
