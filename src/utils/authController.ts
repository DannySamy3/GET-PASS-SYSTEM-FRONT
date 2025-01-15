import axiosInstance from "./axioInstance";

export const sendToken = async (email: string) => {
  try {
    const response = await axiosInstance.post("getPass/auth", { email });
    console.log(response);
    return response;
  } catch (error) {
    throw error;
  }
};
