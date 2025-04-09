import axiosInstance from "./axioInstance";

export const getstudentPayment = async (studentId: string) => {
  try {
    console.log("Fetching payments for student ID:", studentId);
    const response = await axiosInstance.get(`/getPass/payments/${studentId}`);
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

export const editPayment = async (data: any) => {
  try {
    const response = await axiosInstance.patch("/getPass/payments", data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editPaymentById = async (id: string, data: any) => {
  try {
    console.log("Calling editPaymentById with ID:", id, "and data:", data);
    const response = await axiosInstance.patch(`/getPass/payments/${id}`, data);
    console.log("editPaymentById response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in editPaymentById:", error);
    throw error;
  }
};
