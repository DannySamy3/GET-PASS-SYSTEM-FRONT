import axiosInstance from "./axioInstance";
export const getSponsorById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/getPass/sponsors/${id}`);
    return response;
  } catch (error) {}
};
