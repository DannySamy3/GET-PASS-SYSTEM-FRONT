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
