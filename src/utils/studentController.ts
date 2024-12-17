import axiosInstance from "./axioInstance";

export const getAllStudent = async () => {
  try {
    const response = await axiosInstance.get("getPass/students");
    return response;
  } catch (error) {
    throw error;
  }
};
export const getRegisteredStudents = async () => {
  try {
    const response = await axiosInstance.get("getPass/students/registered");
    return response;
  } catch (error) {
    throw error;
  }
};
export const getStudentsStats = async () => {
  try {
    const response = await axiosInstance.get("getPass/students/stats");
    return response;
  } catch (error) {}
};
