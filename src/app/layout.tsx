"use client"; // Mark as a client component since we are using hooks

import "./globals.css";
import { useState } from "react";
import LeftNavigation from "@/components/leftNavigation/LeftNavigation";
import { Provider } from "react-redux";
import { store } from "@/utils/store";
import { ToastContainer } from "react-toastify";
import { showToast } from "@/utils/toastSlice"; // Import the action
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS
import Login from "@/components/login/Login";
import { Register } from "@/components/register/Register";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeNav = () => {
    setIsCollapsed(false);
  };

  return (
    <html lang='en'>
      <head>
        <title>Get Pass</title>
        <meta
          name='description'
          content='A platform to manage and streamline your passes efficiently.'
        />
      </head>
      <body className='bg-[#F9F9F9]'>
        <Provider store={store}>
          <Login />
          {/* <Register /> */}
          {/* <div className='flex h-screen'>
            {!isCollapsed && (
              <button
                onClick={toggleCollapse}
                className=' p-2 absolute lg:hidden right-[2px] top-[2px]'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-6 lg:hidden '
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  />
                </svg>
              </button>
            )}

            <div
              className={`transition-width duration-300 ${
                isCollapsed ? "w-16" : "w-[300px]"
              } bg-gray-200 flex-shrink-0 hidden lg:block`}
            >
              <LeftNavigation
                setIsCollapsed={setIsCollapsed}
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                closeNav={closeNav}
              />
            </div>

            <div className='flex-grow overflow-y-auto transition-all duration-300 p-4'>
              <div>{children}</div>
            </div>

            {isCollapsed && (
              <div
                className={`  lg:hidden  fixed inset-0 bg-gray-200 z-50 transition-transform`}
              >
                <LeftNavigation
                  setIsCollapsed={setIsCollapsed}
                  isCollapsed={!isCollapsed}
                  toggleCollapse={toggleCollapse}
                  closeNav={closeNav}
                />
              </div>
            )}
          </div> */}
          <ToastContainer
            position='top-right'
            autoClose={3000}
            style={{ zIndex: 9999 }}
          />
        </Provider>
      </body>
    </html>
  );
}
