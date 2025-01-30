import React, { useEffect, useState } from "react";
import { getSponsors } from "@/utils/sponsorController";
import { getClasses } from "@/utils/classController";
import { fetchCountries } from "@/utils/helper";
import { addStudent } from "@/utils/studentController";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";

import "react-toastify/dist/ReactToastify.css";

interface Country {
  name: {
    common: string;
  };
}

interface User {
  firstName: string;
  lastName: string;
  secondName: string;
  email: string;
  phoneNumber: string;
  sponsorId: string;
  nationality: string;
  classId: string;
  gender: string;
  enrollmentYear: string;
}

export const AddStudent = () => {
  const [userInfo, setUserInfo] = useState<User>({
    firstName: "",
    lastName: "",
    secondName: "",
    email: "",
    phoneNumber: "",
    sponsorId: "",
    nationality: "",
    classId: "",
    gender: "",
    enrollmentYear: "",
  });

  const [sponsors, setSponsors] = useState<any[]>([]);

  const [classes, setClasses] = useState<any[]>([]);
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [isToastShown, setIsToastShown] = useState<boolean>(false); // Track toast visibility

  const dispatch = useDispatch();

  // Fetch sponsors from API
  const handleFetchSponsor = async () => {
    try {
      const response = await getSponsors();
      if (response) setSponsors(response?.data.data);
    } catch (error) {
      dispatch(
        showToast({ message: "Failed to fetch sponsors", type: "error" })
      );
    }
  };

  // Fetch classes from API
  const handleFetchClasses = async () => {
    try {
      const response = await getClasses();
      if (response) setClasses(response?.classes);
    } catch (error) {
      dispatch(
        showToast({ message: "Failed to fetch classes", type: "error" })
      );
    }
  };

  // Handle form field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, name } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (Add student)
  const addNewStudent = async () => {
    const currentYear = new Date().getFullYear().toString();
    userInfo.enrollmentYear = currentYear;

    try {
      const response = await addStudent(userInfo);
      if (response?.data) {
        dispatch(
          showToast({ message: "Student added successfully!", type: "success" })
        );
        setIsToastShown(true); // Set toast as shown after successful submission

        setUserInfo({
          firstName: "",
          lastName: "",
          secondName: "",
          email: "",
          phoneNumber: "",
          sponsorId: "",
          nationality: "",
          classId: "",
          gender: "",
          enrollmentYear: "",
        });
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message ||
            "Failed to add student. Please try again.",

          type: "error",
        })
      );
      // setIsToastShown(false);

      setUserInfo({
        firstName: "",
        lastName: "",
        secondName: "",
        email: "",
        phoneNumber: "",
        sponsorId: "",
        nationality: "",
        classId: "",
        gender: "",
        enrollmentYear: "",
      }); // Don't show toast if there's an error
    }
  };

  useEffect(() => {
    handleFetchSponsor();
    handleFetchClasses();
    // handleCountries();
    // setIsPageLoaded(true); // Set page as loaded on initial mount
  }, []);

  // useEffect(() => {
  //   // Reset the toast state when the page is loaded and toast is not shown
  //   if (isPageLoaded && !isToastShown) {
  //     dispatch(showToast({ message: "", type: "success" })); // Reset toast message and type
  //   }
  // }, [isPageLoaded, isToastShown, dispatch]);

  return (
    <div className='relative'>
      <section className='my-4 bg-gradient-to-tr from-gray-100 to-gray-50 border font-montserrat py-4 rounded-[12px] w-full'>
        <section className='flex px-12 flex-col my-3 gap-y-[10px]'>
          <label className='text-sm text-[#414141] font-[500]'>
            First Name
          </label>
          <input
            onChange={handleChange}
            value={userInfo.firstName}
            required
            name='firstName'
            type='text'
            placeholder="Enter student's first name"
            className='border input input-md text-[#414141] border-[#D9CBCB] rounded-[8px] h-[34px]'
          />
          <label className='text-sm text-[#414141] font-[500]'>
            Second Name
          </label>
          <input
            name='secondName'
            value={userInfo.secondName}
            onChange={handleChange}
            required
            type='text'
            placeholder="Enter student's middle name"
            className='border input input-md text-[#414141] border-[#D9CBCB] rounded-[8px] h-[34px]'
          />
          <label className='text-sm text-[#414141] font-[500]'>SurName</label>
          <input
            name='lastName'
            value={userInfo.lastName}
            onChange={handleChange}
            required
            type='text'
            placeholder="Enter student's last name"
            className='border input input-md text-[#414141] border-[#D9CBCB] rounded-[8px] h-[34px]'
          />
          <label className='text-sm text-[#414141] font-[500]'>
            Nationality
          </label>
          <select
            name='nationality'
            value={userInfo.nationality}
            required
            onChange={handleChange}
            className='select select-sm border border-[#D9CBCB] h-[34px]'
          >
            <option value=''>Select Country</option>
            {fetchCountries.map((country, i) => (
              <option key={i} value={country}>
                {country}
              </option>
            ))}
          </select>
          <label className='text-sm text-[#414141] font-[500]'>Gender</label>
          <select
            name='gender'
            value={userInfo.gender}
            required
            onChange={handleChange}
            className='select select-sm border border-[#D9CBCB] h-[34px]'
          >
            <option value={""}>Select Gender</option>
            <option value='Female'>Female</option>
            <option value='Male'>Male</option>
          </select>
          <label className='text-sm text-[#414141] font-[500]'>
            Phone Number
          </label>
          <input
            name='phoneNumber'
            onChange={handleChange}
            value={userInfo.phoneNumber}
            type='text'
            required
            placeholder='Enter an active mobile number'
            className='border input text-[#414141] input-md border-[#D9CBCB] rounded-[8px] h-[34px]'
          />
          <label className='text-sm text-[#414141] font-[500]'>Email</label>
          <input
            name='email'
            value={userInfo.email}
            required
            onChange={handleChange}
            type='email'
            placeholder='Enter an active email'
            className='border input text-[#414141] input-md border-[#D9CBCB] rounded-[8px] h-[34px]'
          />
          <label className='text-sm text-[#414141] font-[500]'>Class</label>
          <select
            name='classId'
            value={userInfo.classId}
            required
            onChange={handleChange}
            className='select select-sm border border-[#D9CBCB] h-[34px]'
          >
            <option value=''>Select Class</option>
            {classes.map((classId, i) => (
              <option key={i} value={classId._id}>
                {classId.name}
              </option>
            ))}
          </select>
          <label className='text-sm text-[#414141] font-[500]'>Sponsor</label>
          <select
            onChange={handleChange}
            value={userInfo.sponsorId}
            required
            name='sponsorId'
            className='select select-sm border border-[#D9CBCB] h-[34px]'
          >
            <option value=''>Select Sponsor</option>
            {sponsors.map((sponsorId, i) => (
              <option key={i} value={sponsorId._id}>
                {sponsorId.name}
              </option>
            ))}
          </select>
        </section>

        <div className='flex my-5 justify-end w-full'>
          <button
            onClick={addNewStudent}
            className='btn rounded-[8px] border bg-[#3A7563] text-white w-[15%] mx-auto hover:text-white btn-success'
          >
            Register
          </button>
        </div>
      </section>
    </div>
  );
};

export default AddStudent;
