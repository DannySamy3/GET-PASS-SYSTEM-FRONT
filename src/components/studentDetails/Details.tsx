import React, { useEffect, useState } from "react";
import { getStudentById, editStudent } from "@/utils/studentController";
import { getClassById } from "@/utils/classController";
import { getSponsorById } from "@/utils/sponsorController";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import ToastNotification from "@/components/toastNotification/ToastNotification";
import { FaPencilAlt } from "react-icons/fa";
import { editImage } from "@/utils/imageController";

interface props {
  id: any;
  setView: any;
  setDate: any;
}

export const Details: React.FC<props> = ({ id, setView, setDate }) => {
  const [student, setStudent] = useState<any>();
  const [selectStatus, setSelectStatus] = useState("");
  const [edit, setEdit] = useState(false);

  const dispatch = useDispatch();

  const getDetails = async () => {
    try {
      const result = await getStudentById(id);

      if (result) {
        // @ts-ignore
        const classData = await getClassById(result?.data.classId);
        // @ts-ignore
        const sponsorData = await getSponsorById(result?.data.sponsor);

        setStudent({
          // @ts-ignore
          ...result.data,
          // @ts-ignore
          className: classData.data.name,
          // @ts-ignore
          sponsorName: sponsorData?.data.data.name,
        });
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message ||
            "Network issue, please check your connection.",
          type: "error",
        })
      );
    }
  };

  const handleEditStatus = async (id: string) => {
    try {
      await editStudent(id, selectStatus);
      getDetails();
    } catch (error) {}
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("File size (MB):", file.size / (1024 * 1024)); // Convert to MB
      // Log file size for debugging
      if (file.size > 50 * 1024 * 1024) {
        // Check for 50MB file size
        alert("File is too large!");
        return;
      }
      // const reader = new FileReader();
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await editImage(student.id, formData);
        //@ts-ignore
        if (!response.ok) {
          throw new Error("Failed to update image");
        }
        //@ts-ignore
        const result = await response.json();
        setStudent((prev: any) => ({
          ...prev,
          image: result.imageUrl, // Assuming the backend sends the image URL in response
        }));
        dispatch(
          showToast({
            message: "Image updated successfully",
            type: "success",
          })
        );
      } catch (error) {
        dispatch(
          showToast({
            message: "Failed to update image",
            type: "error",
          })
        );
      }

      // reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    getDetails();
  }, [student?.status]);

  return (
    <div className=' h-[80vh] '>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full font-montserrat '>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-3xl font-bold text-gray-700'>Student Details</h2>
          <div className='flex space-x-4'>
            <button
              onClick={() => {
                setView((prev: any) => ({ ...prev, view: false }));
                setDate(false);
              }}
              className='btn btn-error text-white'
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setEdit((prev) => !prev);
                if (edit) handleEditStatus(id);
              }}
              className={`btn ${edit ? "btn-success" : "btn-info"} text-white`}
            >
              {edit ? "Save" : "Edit"}
            </button>
          </div>
        </div>
        <div className='fle justify-center my-6 relative'>
          {student?.image ? (
            <div className=' flex items-center gap-[%]'>
              <img
                src={student.image}
                alt='Student'
                className='h-32 w-32 rounded-full object-cover'
              />
              <input
                type='file'
                id='image-upload'
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor='image-upload'>
                <FaPencilAlt
                  className='  text-gray-600 absolute bottom-[15px] left-[100px] cursor-pointer'
                  style={{ transform: "translate(50%, 50%)" }}
                />
              </label>
            </div>
          ) : (
            <div className='h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500'></div>
            </div>
          )}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6  '>
          <div className='flex flex-col'>
            <label className='text-[16px] text-gray-600 font-medium'>
              Full Name
            </label>
            <span className='text-[15px] font-semibold  text-gray-700'>{`${
              student?.firstName ?? ""
            } ${student?.secondName ?? ""} ${student?.lastName ?? ""}`}</span>
          </div>
          <div className='flex flex-col'>
            <label className='text-[16px] text-gray-600 font-medium'>
              Gender
            </label>
            <span className='text-[15px] font-semibold text-gray-700'>
              {student?.gender}
            </span>
          </div>
          <div className='flex flex-col'>
            <label className='text-[16px] text-gray-600 font-medium'>
              Email
            </label>
            <span className='text-[15px] font-semibold text-gray-700'>
              {student?.email}
            </span>
          </div>
          <div className='flex flex-col'>
            <label className='text-[16px] text-gray-600 font-medium'>
              Phone Number
            </label>
            <span className='text-[15px] font-semibold text-gray-700'>
              {student?.phoneNumber}
            </span>
          </div>
          <div className='flex flex-col'>
            <label className='text-[16px] text-gray-600 font-medium'>
              Nationality
            </label>
            <span className='text-[15px] font-semibold text-gray-700'>
              {student?.nationality}
            </span>
          </div>
          <div className='flex flex-col'>
            <label className='text-[16px] text-gray-600 font-medium'>
              Class
            </label>
            <span className='text-[15px] font-semibold text-gray-700'>
              {student?.className}
            </span>
          </div>
          <div className='flex flex-col'>
            <label className='text-[16px] text-gray-600 font-medium'>
              Registration Number
            </label>
            <span className='text-[15px] font-semibold text-gray-700'>
              {student?.regNo}
            </span>
          </div>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-600 font-medium'>Sponsor</label>
            <span className='text-[16px] font-semibold text-gray-700'>
              {student?.sponsorName}
            </span>
          </div>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-600 font-medium'>
              Registration Status
            </label>
            {edit ? (
              <select
                onChange={(e: any) => setSelectStatus(e.target.value)}
                className='select select-sm border border-gray-300  rounded-md text-gray-700'
              >
                <option value={""}>Edit Status</option>
                <option value={"REGISTERED"} className='text-green-600'>
                  REGISTERED
                </option>
                <option value={"NOT REGISTERED"} className='text-red-600'>
                  NOT REGISTERED
                </option>
              </select>
            ) : (
              <span
                className={`text-[15px] font-semibold  ${
                  student?.status === "NOT REGISTERED"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {student?.status}
              </span>
            )}
          </div>
        </div>
      </div>
      <ToastNotification />
    </div>
  );
};
