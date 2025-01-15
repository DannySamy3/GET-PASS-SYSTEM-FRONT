"use client"; // Mark as a client component since we are using hooks

import "./globals.css";
import { useState, useEffect } from "react";
import LeftNavigation from "@/components/leftNavigation/LeftNavigation";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "@/utils/store";
import { ToastContainer } from "react-toastify";
import { showToast } from "@/utils/toastSlice"; // Import the action
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS
import Login from "@/components/login/Login";
import {
  selectIsLogin,
  setIsLogin,
  selectHideLogin,
  setHideLogin,
} from "@/utils/authSlice";

function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [hideLogin, setHideLogin] = useState(true);
  const isLoggedIn = useSelector(selectIsLogin); // Correctly using useSelector now
  const hideLogin = useSelector(selectHideLogin); // Correctly using useSelector now
  const loginHide = useSelector(selectHideLogin);

  const dispatch = useDispatch(); // Initialize dispatch if you want to use actions
  // const router = useRouter();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeNav = () => {
    setIsCollapsed(false);
  };

  // Function to handle successful login
  const handleLoginSuccess = (value: boolean) => {
    dispatch(setIsLogin(value)); // Use dispatch to update the Redux store
  };
  const handleSetIsLogin = (value: boolean) => {
    dispatch(setHideLogin(value)); // Use dispatch to update the Redux store
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
        {isLoggedIn ? (
          <div className='flex h-screen'>
            {/* Left Navigation */}
            <div
              className={`transition-width duration-300 ${
                isCollapsed ? "w-16" : "w-[300px]"
              } bg-gray-200 flex-shrink-0 hidden lg:block
              }`}
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

            {/* Collapsed View for Mobile */}
            {isCollapsed && (
              <div
                className={`lg:hidden  fixed inset-0 bg-gray-200 z-50 transition-transform`}
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
        ) : (
          <div className='h-screen '>
            {!loginHide && (
              <Login
                onLoginSuccess={handleLoginSuccess}
                hideLogin={handleSetIsLogin}
                loginHide={loginHide}
              />
            )}

            {loginHide && (
              <div className=' h-screen overflow-y-hidden'>{children}</div>
            )}
          </div>
        )}

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
