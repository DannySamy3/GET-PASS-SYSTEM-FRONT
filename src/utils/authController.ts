import axiosInstance from "./axioInstance";

export const sendToken = async (email: string) => {
  try {
    const response = await axiosInstance.post("getPass/auth", { email });
    console.log("sending..");
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const reSendToken = async (email: string) => {
  try {
    const response = await axiosInstance.post("getPass/auth//resendToken", {
      email,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyCode = async (email: string, verificationCode: string) => {
  try {
    const response = await axiosInstance.post("getPass/auth/verifyToken", {
      email,
      verificationCode,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const completeRegister = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "getPass/auth/registerUser",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const handleLogin = async (data: any) => {
  console.log("Attempting login with data:", data);
  try {
    console.log("Making API call to:", "getPass/auth/login");
    const response = await axiosInstance.post("getPass/auth/login", data);
    console.log("API Response:", response);
    return response;
  } catch (error) {
    // console.error("Login API error:", error);
    throw error;
  }
};
