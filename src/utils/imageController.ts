import axiosInstance from "./axioInstance";

export const editImage = async (
  file: File,
  previousImageUrl: string,
  studentId: any
) => {
  try {
    const formData = new FormData();
    formData.append("file", file); // Add the file to the form data
    formData.append("studentId", studentId); // Add the file to the form data
    formData.append("previousImageUrl", previousImageUrl); // Add previous image URL if needed

    const response = await axiosInstance.put("/getPass/images/edit", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure that the Content-Type is set for multipart/form-data
      },
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
