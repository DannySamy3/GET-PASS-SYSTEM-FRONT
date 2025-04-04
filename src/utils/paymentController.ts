import axiosInstance from "./axioInstance";

export const getPaymentById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/getPass/payments/student/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
