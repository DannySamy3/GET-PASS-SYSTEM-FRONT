import axiosInstance from "./axioInstance";
import { ToastContainer } from "react-toastify"; // Import Toastify
import { useDispatch } from "react-redux"; // Import useDispatch to dispatch actions
import { showToast } from "@/utils/toastSlice"; // Import the showToast action

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

export const getAllStudents = async (query = {}) => {
  try {
    if (query && Object.keys(query).length > 0) {
      const queryString = new URLSearchParams(query).toString().trim();

      const response = await axiosInstance.get(
        `/getPass/students?${queryString}`
      );
      return response;
    } else {
      const response = await axiosInstance.get("/getPass/students");
      return response;
    }
  } catch (error) {}
};

export const getStudentById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/getPass/students/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const editStudent = async (id: string, data: string) => {
  try {
    const response = await axiosInstance.patch(`/getPass/students/${id}`, {
      status: data,
    });
    return response;
  } catch (error) {}
};
export const addStudent = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/getPass/students`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
