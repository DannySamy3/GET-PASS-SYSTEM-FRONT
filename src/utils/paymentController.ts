import axiosInstance from "./axioInstance";

export const getstudentPaymentById = async (
  studentId: string,
  sessionId: string
) => {
  try {
    const response = await axiosInstance.get(
      `/getPass/payments/student/${studentId}/${sessionId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createPayment = async (data: any) => {
  try {
    const response = await axiosInstance.post("/getPass/payments", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
