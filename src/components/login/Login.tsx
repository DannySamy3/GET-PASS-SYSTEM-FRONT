import React from "react";
import { useState } from "react";
import { SignUp } from "./SignUp";

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [input, setInput] = useState({ email: "", password: "" });
  const [emailError, setEmailError] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  function isInvalidEmailFormat(email: string) {
    // Regular expression to match a valid email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Test the email against the regex
    return !emailRegex.test(email); // Returns true if invalid, false if valid
  }

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Check for email validation
    if (name === "email" && value != "") {
      const isInvalid = isInvalidEmailFormat(value);
      setEmailError(isInvalid);
    } else setEmailError(false);

    // Update other fields in the input state
    setInput((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className=' bg-white p- rounded-xl font-montserrat h-screen  overflow-y-hidden'>
      <article className=' flex h-full'>
        <section className=' w-[50%] font-[500] flex text-[32px] justify-center items-center'>
          GATE PASS SYSTEM
        </section>
        <SignUp
          handleInputs={handleInputs}
          togglePasswordVisibility={togglePasswordVisibility}
          input={input}
          emailError={emailError}
          isPasswordVisible={isPasswordVisible}
        />
      </article>
    </div>
  );
};

export default Login;
