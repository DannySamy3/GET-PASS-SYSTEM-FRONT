import axiosInstance from "./axioInstance";

export const getSponsorById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/getPass/sponsors/${id}`);
    return response;
  } catch (error) {}
};
export const getSponsors = async () => {
  try {
    const response = await axiosInstance.get(`/getPass/sponsors`);
    return response;
  } catch (error) {}
};
export const createSponsors = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/getPass/sponsors`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
export const deleteSponsors = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/getPass/sponsors/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const editSponsors = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.patch(`/getPass/sponsors/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};
