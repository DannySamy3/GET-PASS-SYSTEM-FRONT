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
  image: File | null;
}

interface AddStudentResponse {
  data: {
    student: User;
  };
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
    image: null,
  });

  const [sponsors, setSponsors] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [isToastShown, setIsToastShown] = useState<boolean>(false);

  const dispatch = useDispatch();

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, name } = e.target;
    if (name === "image" && (e.target as HTMLInputElement).files) {
      setUserInfo((prev) => ({
        ...prev,
        image: (e.target as HTMLInputElement).files![0],
      }));
    } else {
      setUserInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addNewStudent = async () => {
    const currentYear = new Date().getFullYear().toString();
    userInfo.enrollmentYear = currentYear;

    const formData = new FormData();
    Object.keys(userInfo).forEach((key) => {
      formData.append(key, userInfo[key as keyof User] as any);
    });
    // if (userInfo.image) {
    //   formData.append("image", userInfo.image);
    // }

    try {
      const response = (await addStudent(formData)) as AddStudentResponse;
      if (response.data) {
        dispatch(
          showToast({ message: "Student added successfully!", type: "success" })
        );
        setIsToastShown(true);

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
          image: null,
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
        image: null,
      });
    }
  };

  useEffect(() => {
    handleFetchSponsor();
    handleFetchClasses();
  }, []);

  return (
    <div className='relative'>
      <section className='my-4 bg-gradient-to-tr bg-gray-50 h-[86vh] border font-montserrat py-4 rounded-[12px] w-full shadow-lg'>
        <h2 className='text-3xl font-bold text-center mb-6 text-gray-500'>
          Add New Student
        </h2>
        <section className='flex px-12 flex-col my-3 gap-y-[10px]'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col'>
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
                className='border input input-md text-[#414141] border-[#D9CBCB] rounded-[8px] h-[34px] bg-white'
              />
            </div>
            <div className='flex flex-col'>
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
                className='border input input-md text-[#414141] border-[#D9CBCB] rounded-[8px] h-[34px] bg-white'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm text-[#414141] font-[500]'>
                SurName
              </label>
              <input
                name='lastName'
                value={userInfo.lastName}
                onChange={handleChange}
                required
                type='text'
                placeholder="Enter student's last name"
                className='border input input-md text-[#414141] border-[#D9CBCB] rounded-[8px] h-[34px] bg-white'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm text-[#414141] font-[500]'>
                Nationality
              </label>
              <select
                name='nationality'
                value={userInfo.nationality}
                required
                onChange={handleChange}
                className='select select-sm border border-[#D9CBCB] h-[34px] bg-white'
              >
                <option value=''>Select Country</option>
                {fetchCountries.map((country, i) => (
                  <option key={i} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col'>
              <label className='text-sm text-[#414141] font-[500]'>
                Gender
              </label>
              <select
                name='gender'
                value={userInfo.gender}
                required
                onChange={handleChange}
                className='select select-sm border border-[#D9CBCB] h-[34px] bg-white'
              >
                <option value={""}>Select Gender</option>
                <option value='Female'>Female</option>
                <option value='Male'>Male</option>
              </select>
            </div>
            <div className='flex flex-col'>
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
                className='border input text-[#414141] input-md border-[#D9CBCB] rounded-[8px] h-[34px] bg-white'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm text-[#414141] font-[500]'>Email</label>
              <input
                name='email'
                value={userInfo.email}
                required
                onChange={handleChange}
                type='email'
                placeholder='Enter an active email'
                className='border input text-[#414141] input-md border-[#D9CBCB] rounded-[8px] h-[34px] bg-white'
              />
            </div>
            <div className='flex flex-col'>
              <label className='text-sm text-[#414141] font-[500]'>Class</label>
              <select
                name='classId'
                value={userInfo.classId}
                required
                onChange={handleChange}
                className='select select-sm border border-[#D9CBCB] h-[34px] bg-white'
              >
                <option value=''>Select Class</option>
                {classes.map((classId, i) => (
                  <option key={i} value={classId._id}>
                    {classId.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col'>
              <label className='text-sm text-[#414141] font-[500]'>
                Sponsor
              </label>
              <select
                onChange={handleChange}
                value={userInfo.sponsorId}
                required
                name='sponsorId'
                className='select select-sm border border-[#D9CBCB] h-[34px] bg-white'
              >
                <option value=''>Select Sponsor</option>
                {sponsors.map((sponsorId, i) => (
                  <option key={i} value={sponsorId._id}>
                    {sponsorId.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex flex-col col-span-1 md:col-span-2'>
              <label className='text-sm text-[#414141] font-[500]'>Photo</label>
              <div className='flex items-center'>
                <input
                  name='image'
                  type='file'
                  accept='image/*'
                  onChange={handleChange}
                  className='hidden'
                  id='image-upload'
                />
                <label
                  htmlFor='image-upload'
                  className='cursor-pointer border border-[#D9CBCB] rounded-[8px] h-[34px] flex items-center justify-center px-4 py-2 bg-white text-[#414141]'
                >
                  Upload Photo
                </label>
                {userInfo.image && (
                  <div className='ml-4'>
                    <img
                      src={URL.createObjectURL(userInfo.image)}
                      alt='Student Photo'
                      className='h-[34px] w-[34px] rounded-full object-cover'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className='flex my-5 justify-center w-full'>
          <button
            onClick={addNewStudent}
            className='btn rounded-[8px] border bg-[#3A7563] text-white w-[25%] hover:text-white btn-success'
          >
            Register
          </button>
        </div>
      </section>
    </div>
  );
};

export default AddStudent;
