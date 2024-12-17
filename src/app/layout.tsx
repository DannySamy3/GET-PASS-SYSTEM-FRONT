"use client"; // Mark as a client component since we are using hooks

import "./globals.css";
import { useState } from "react";
import LeftNavigation from "@/components/leftNavigation/LeftNavigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
        <div className='flex h-screen'>
          {/* Left Navigation */}
          <div
            className={`transition-width duration-300 ${
              isCollapsed ? "w-16" : "w-[300px]"
            } bg-gray-200 flex-shrink-0 hidden lg:block`}
          >
            <LeftNavigation
              setIsCollapsed={setIsCollapsed}
              isCollapsed={isCollapsed}
              toggleCollapse={toggleCollapse}
            />
          </div>

          {/* Main Content */}
          <div className='flex-grow overflow-y-auto transition-all duration-300 p-4'>
            <div>{children}</div>
          </div>

          {/* Mobile Navigation */}
          {!isCollapsed && (
            <div className='lg:hidden fixed inset-0 bg-gray-200 z-50 transition-transform'>
              <LeftNavigation
                setIsCollapsed={setIsCollapsed}
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
              />
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
