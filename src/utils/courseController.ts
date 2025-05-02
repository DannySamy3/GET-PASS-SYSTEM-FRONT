import axiosInstance from "./axioInstance";

export const fetchClasses = async () => {
  try {
    const response = await axiosInstance.get("/getPass/classes");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getClassById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/getPass/classes/${id}`);
    return response;
  } catch (error) {}
};
export const deleteClass = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/getPass/classes/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const editClass = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.patch(`/getPass/classes/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const createClass = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/getPass/classes/`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
