import axiosInstance from "./axioInstance";

export const getScanInfo = async (date: string) => {
  try {
    const response = await axiosInstance.get(`/getPass/scans`, {
      params: {
        date: date,
      },
    });
    return response;
  } catch (error) {}
};
