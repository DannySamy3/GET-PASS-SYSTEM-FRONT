import axiosInstance from "./axioInstance";

export const editImage = async (fileName: string, newImageData: any) => {
  try {
    const response = await axiosInstance.put("/getPass/images/edit", {
      fileName,
      newImageData,
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update image: ${error.message}`);
    } else {
      throw new Error("Failed to update image: Unknown error");
    }
  }
};
