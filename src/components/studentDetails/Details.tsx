import React, { useEffect, useState } from "react";
import { getStudentById } from "@/utils/studentController";
interface props {
  id: any;
}

export const Details: React.FC<props> = ({ id }) => {
  const [student, setStudent] = useState<any>();
  const getDetails = async () => {
    try {
      const result = await getStudentById(id);

      if (result) {
        setStudent(result.data);
        console.log(result.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getDetails();
  }, []);
  return (
    <div className=' bg-white my-12 py-6   px-[50px] font-montserrat border overflow-y-hidden     border-[#D6D4D4] rounded-[12px] w-full '>
      <section>
        <div className=' flex justify-between items-center mt-1 mb-8'>
          <span className=' font-[600] text-lg'>STUDENT DETAILS</span>
          <div className=' w-[13%] flex justify-between items-center'>
            <button className=' btn'>CANCEL</button>
            <button className=' btn'>EDIT</button>
          </div>
        </div>
        <div className=' grid grid-cols-[1fr_1fr] gap-y-7'>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Full Name
          </label>
          <span className=' text-[15px]  '>{`${student?.firstName} ${student?.secondName} ${student?.lastName}`}</span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Gender
          </label>
          <span className=' text-[15px]  '>{student?.gender}</span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Email
          </label>
          <span className=' text-[15px]  '>{student?.email}</span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Phone Number
          </label>
          <span className=' text-[15px]  '>{student?.phoneNumber}</span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Nationality
          </label>
          <span className=' text-[15px]  '>{student?.nationality}</span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Class
          </label>
          <span className=' text-[15px]  '>{"value"}</span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Registration Number
          </label>
          <span className=' text-[15px]  '>{student?.regNo}</span>
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Sponsor
          </label>
          <span className=' text-[15px]  '>{student?.sponsor}</span>
          {/* <label className=' text-[15px] font-[500] text-[#414141]'>
            Amount Paid
          </label>
          <span className=' text-[15px]  '>{"value"}</span> */}
          <label className=' text-[15px] font-[500] text-[#414141]'>
            Registration Status
          </label>
          <span
            className={` ${
              student?.status === "NOT REGISTERED"
                ? "text-[#FB5959]"
                : "text-[#1BAD22]"
            } text-[15px] font-[600]`}
          >
            {student?.status}
          </span>
          {/* <select className=' rounded-lg border border-[#DBDADA] outline-none w-[50%]'>
            <option>20000</option>
          </select> */}
        </div>
      </section>
    </div>
  );
};
