import React, { useEffect, useState } from "react";
import { getStudentById, editStudent } from "@/utils/studentController";
import { getClassById } from "@/utils/classController";
import { getSponsorById } from "@/utils/sponsorController";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import ToastNotification from "@/components/toastNotification/ToastNotification";
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

  useEffect(() => {
    getDetails();
  }, [student?.status]);

  return (
    <div className=' bg-white my-12 py-10     px-[56px] font-montserrat border overflow-y-hidden     border-[#D6D4D4] rounded-[12px] w-full '>
      <section>
        <div className=' flex justify-between items-center mt-1 mb-9'>
          <span className=' font-[600] text-[#475053] text-lg'>
            STUDENT DETAILS
          </span>
          <div className=' w-[15%] flex justify-between items-center'>
            <button
              onClick={() => {
                setView((prev: any) => ({ ...prev, view: false }));
                setDate(false);
              }}
              className=' w-[45%] btn btn-error text-white'
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                setEdit((prev) => !prev);
                if (edit) handleEditStatus(id);
              }}
              className={`btn ${
                edit ? "btn-success" : "btn-info"
              } btn-info text-white w-[45%]`}
            >
              {edit ? "Save" : "Edit"}
            </button>
          </div>
        </div>
        <div className=' overflow-y-hidden grid grid-cols-[1fr_1fr] gap-y-9'>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Full Name
          </label>
          <span className=' text-[15px] font-[500] text-[#8B8B8B]   '>{`${
            student?.firstName ?? ""
          } ${student?.secondName ?? ""} ${student?.lastName ?? ""}`}</span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Gender
          </label>
          <span className=' text-[15px] font-[500] text-[#8B8B8B] '>
            {student?.gender}
          </span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Email
          </label>
          <span className=' text-[15px] font-[500] text-[#8B8B8B] '>
            {student?.email}
          </span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Phone Number
          </label>
          <span className=' text-[15px] font-[500] text-[#8B8B8B]  '>
            {student?.phoneNumber}
          </span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Nationality
          </label>
          <span className=' text-[15px] font-[500] text-[#8B8B8B]  '>
            {student?.nationality}
          </span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Class
          </label>
          <span className=' text-[15px] font-[500] text-[#8B8B8B] '>
            {student?.className}
          </span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Registration Number
          </label>
          <span className=' text-[15px] font-[500] text-[#8B8B8B]  '>
            {student?.regNo}
          </span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Sponsor
          </label>
          <span className=' text-[15px] font-[500] text-[#8B8B8B]'>
            {student?.sponsorName}
          </span>
          {/* <label className=' text-[15px] font-[500] text-[#414141]'>
            Amount Paid
          </label>
          <span className=' text-[15px]  '>{"value"}</span> */}
          <label className=' text-[15px] font-[600] text-[#414141]'>
            Registration Status
          </label>

          {edit ? (
            <select
              onChange={(e: any) => setSelectStatus(e.target.value)}
              className=' select select-sm w-fit border font-[500] border-[#737171] text-[#8B8B8B] text-[15px]'
            >
              <option value={""}>EDIT STATUS</option>
              <option
                value={"REGISTERED"}
                className=' text-[#1BAD22] text-[15px] font-[600]'
              >
                REGISTERED
              </option>
              <option
                value={"NOT REGISTERED"}
                className='  text-[#FB5959]  text-[15px] font-[600]'
              >
                NOT REGISTERED
              </option>
            </select>
          ) : (
            <span
              className={` ${
                student?.status === "NOT REGISTERED"
                  ? "text-[#FB5959]"
                  : "text-[#1BAD22]"
              } text-[15px] font-[600]`}
            >
              {student?.status}
            </span>
          )}
          {/* <select className=' rounded-lg border border-[#DBDADA] outline-none w-[50%]'>
            <option>20000</option>
          </select> */}
        </div>
      </section>
      <ToastNotification />
    </div>
  );
};
