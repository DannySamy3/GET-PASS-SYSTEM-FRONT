"use client"; // Mark as a client component since we are using hooks

import "./globals.css";
import { useState } from "react";
import LeftNavigation from "@/components/leftNavigation/LeftNavigation";
import { Provider } from "react-redux";
import { store } from "@/utils/store";

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
          <div className='flex h-screen'>
            {/* Left Navigation */}
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

            {/* Main Content */}
            <div className='flex-grow overflow-y-auto transition-all duration-300 p-4'>
              <div>{children}</div>
            </div>

            {/* Mobile Navigation */}
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
          </div>
        </Provider>
      </body>
    </html>
  );
}
