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

export const getAllStudents = async (query = {}) => {
  try {
    console.log(query);

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
  } catch (error) {}
};
