"use client"; // Mark as a client component since we are using hooks

import "./globals.css";
import { useState, useEffect } from "react";
import LeftNavigation from "@/components/leftNavigation/LeftNavigation";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS
import { useRouter, usePathname } from "next/navigation"; // Use usePathname

import { selectLogin } from "@/utils/authenticatorSlice";
import { Provider } from "react-redux";
import { store } from "@/utils/store"; // Redux store import

// RootLayout Component
function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Access Redux state
  const dispatch = useDispatch(); // Initialize dispatch for actions
  const LoggedIn = useSelector(selectLogin); // Check login status

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeNav = () => {
    setIsCollapsed(false);
  };

  // Redirect to login page if not logged in (useEffect to avoid render phase issues)
  useEffect(() => {
    if (!LoggedIn) {
      router.push("/"); // Redirect to login page if not authenticated
    }
  }, [LoggedIn, router]);

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
          {/* Left Navigation is hidden on "/" */}
          {LoggedIn && (
            <div
              key='left-navigation' // Ensure LeftNavigation has a stable key
              className={`transition-width duration-300 ${
                isCollapsed ? "w-16" : "w-[300px]"
              } bg-gray-200 flex-shrink-0 hidden lg:block md:block`}
            >
              <LeftNavigation
                setIsCollapsed={setIsCollapsed}
                isCollapsed={isCollapsed}
                toggleCollapse={toggleCollapse}
                closeNav={closeNav}
              />
            </div>
          )}

          {LoggedIn && !isCollapsed && (
            <button
              onClick={toggleCollapse}
              className='  absolute lg:hidden md:hidden right-[1%] top-[5px]'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6 mt-2 lg:hidden  '
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          )}

          {/* Main Content */}
          <div className='flex-grow overflow-y-auto transition-all duration-300 '>
            <div>{children}</div>
          </div>

          {/* Collapsed View for Mobile */}
          {LoggedIn && isCollapsed && (
            <div className='lg:hidden md:hidden fixed inset-0 bg-gray-200 z-50 transition-transform'>
              <LeftNavigation
                setIsCollapsed={setIsCollapsed}
                isCollapsed={!isCollapsed}
                toggleCollapse={toggleCollapse}
                closeNav={closeNav}
              />
            </div>
          )}
        </div>

        <ToastContainer
          position='top-right'
          autoClose={3000}
          style={{ zIndex: 9999 }}
        />
      </body>
    </html>
  );
}

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <RootLayout>{children}</RootLayout>
    </Provider>
  );
}
