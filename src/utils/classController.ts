import axiosInstance from "./axioInstance";

export const getClassById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/getPass/classes/${id}`);
    return response.data;
  } catch (error) {}
};
export const getClasses = async () => {
  try {
    const response = await axiosInstance.get(`/getPass/classes`);
    return response.data;
  } catch (error) {}
};
