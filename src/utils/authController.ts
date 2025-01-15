import axiosInstance from "./axioInstance";

export const sendToken = async (email: string) => {
  try {
    const response = await axiosInstance.post("getPass/auth", { email });

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
