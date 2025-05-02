"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { getSponsors } from "@/utils/sponsorController";
import { getClasses } from "@/utils/classController";
import { fetchCountries } from "@/utils/helper";
import { addStudent } from "@/utils/studentController";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import { useRouter } from "next/navigation";
import ToastNotification from "../toastNotification/ToastNotification";
import {
  User,
  Book,
  Upload,
  Mail,
  Phone,
  Flag,
  Users,
  CreditCard,
  DollarSign,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Country {
  name: {
    common: string;
  };
}

interface UserInfo {
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
    student: UserInfo;
  };
}

interface ClassInfo {
  _id: string;
  name: string;
  tuitionFee?: number;
}

interface SponsorInfo {
  _id: string;
  name: string;
}

export const AddStudent = ({
  changeView,
}: {
  changeView: (view: boolean) => void;
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
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

  const [sponsors, setSponsors] = useState<SponsorInfo[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleFetchSponsor = async () => {
    try {
      const response = await getSponsors();
      if (response) setSponsors((response.data as { data: any }).data);
    } catch (error) {
      dispatch(
        showToast({ message: "Failed to fetch sponsors", type: "error" })
      );
    }
  };

  const handleFetchClasses = async () => {
    try {
      const response: any = await getClasses();
      if (response) setClasses(response.classes);
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

      // Handle class selection
      if (name === "classId") {
        const selected = classes.find((cls) => cls._id === value) || null;
        setSelectedClass(selected);
      }
    }
  };

  const addNewStudent = async () => {
    const currentYear = new Date().getFullYear().toString();
    userInfo.enrollmentYear = currentYear;

    const formData = new FormData();
    Object.keys(userInfo).forEach((key) => {
      const value = userInfo[key as keyof UserInfo];
      if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });

    setIsPageLoaded(true);
    try {
      const response = (await addStudent(formData)) as AddStudentResponse;
      setIsPageLoaded(false);

      console.log(".....................", response);

      if (response.data) {
        // Dispatch toast before any state changes
        dispatch(
          showToast({
            message: "Student added successfully!",
            type: "success",
          })
        );

        // Reset form state
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

        // Wait for toast duration (typically 3000ms) before changing view
        setTimeout(() => {
          changeView(false);
        }, 3000);
      }
    } catch (error) {
      setIsPageLoaded(false);
      const err = error as { response: { data: { message: string } } };

      // Dispatch error toast
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
    <div className='h-screen w-full flex flex-col overflow-hidden'>
      <div className='flex-1 overflow-y-auto'>
        <div className='min-h-full py-4 px-4 pb-20'>
          <Tabs defaultValue='sponsors' className='w-full'>
            <TabsContent value='sponsors' className='h-full'>
              <Card className='w-full shadow-md rounded-lg border-slate-200'>
                <CardHeader className='bg-gradient-to-r from-indigo-50 via-blue-50 to-white text-indigo-900 rounded-t-lg border-b border-slate-200'>
                  <div className='flex justify-between items-center'>
                    <div>
                      <CardTitle>Add New Student</CardTitle>
                      <CardDescription className='text-indigo-700'>
                        Fill in the student's information below
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => changeView(false)}
                      className='bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200'
                    >
                      <X className='h-4 w-4' />
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className='p-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='firstName'
                        className='flex items-center gap-2 text-indigo-900'
                      >
                        <User className='h-4 w-4 text-indigo-600' />
                        First Name <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='firstName'
                        name='firstName'
                        value={userInfo.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Enter student's first name"
                        className='border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='secondName'
                        className='flex items-center gap-2 text-indigo-900'
                      >
                        <User className='h-4 w-4 text-indigo-600' />
                        Middle Name <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='secondName'
                        name='secondName'
                        value={userInfo.secondName}
                        onChange={handleChange}
                        required
                        placeholder="Enter student's middle name"
                        className='border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='lastName'
                        className='flex items-center gap-2 text-indigo-900'
                      >
                        <User className='h-4 w-4 text-indigo-600' />
                        Surname <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='lastName'
                        name='lastName'
                        value={userInfo.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Enter student's last name"
                        className='border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='nationality'
                        className='flex items-center gap-2 text-indigo-900'
                      >
                        <Flag className='h-4 w-4 text-indigo-600' />
                        Nationality <span className='text-red-500'>*</span>
                      </Label>
                      <Select
                        name='nationality'
                        value={userInfo.nationality}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: "nationality", value },
                          } as React.ChangeEvent<HTMLSelectElement>)
                        }
                      >
                        <SelectTrigger className='border-indigo-200 focus:ring-indigo-500'>
                          <SelectValue placeholder='Select Country' />
                        </SelectTrigger>
                        <SelectContent>
                          {fetchCountries.map((country, i) => (
                            <SelectItem key={i} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='gender'
                        className='flex items-center gap-2 text-indigo-900'
                      >
                        <Users className='h-4 w-4 text-indigo-600' />
                        Gender <span className='text-red-500'>*</span>
                      </Label>
                      <Select
                        name='gender'
                        value={userInfo.gender}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: "gender", value },
                          } as React.ChangeEvent<HTMLSelectElement>)
                        }
                      >
                        <SelectTrigger className='border-indigo-200 focus:ring-indigo-500'>
                          <SelectValue placeholder='Select Gender' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Female'>Female</SelectItem>
                          <SelectItem value='Male'>Male</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='phoneNumber'
                        className='flex items-center gap-2 text-indigo-900'
                      >
                        <Phone className='h-4 w-4 text-indigo-600' />
                        Phone Number <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='phoneNumber'
                        name='phoneNumber'
                        value={userInfo.phoneNumber}
                        onChange={handleChange}
                        required
                        placeholder='Enter an active mobile number'
                        className='border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='email'
                        className='flex items-center gap-2 text-indigo-900'
                      >
                        <Mail className='h-4 w-4 text-indigo-600' />
                        Email <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        value={userInfo.email}
                        onChange={handleChange}
                        required
                        placeholder='Enter an active email'
                        className='border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='classId'
                        className='flex items-center gap-2 text-indigo-900'
                      >
                        <Book className='h-4 w-4 text-indigo-600' />
                        Class <span className='text-red-500'>*</span>
                      </Label>
                      <Select
                        name='classId'
                        value={userInfo.classId}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: "classId", value },
                          } as React.ChangeEvent<HTMLSelectElement>)
                        }
                      >
                        <SelectTrigger className='border-indigo-200 focus:ring-indigo-500'>
                          <SelectValue placeholder='Select Class' />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((classInfo, i) => (
                            <SelectItem key={i} value={classInfo._id}>
                              {classInfo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='sponsorId'
                        className='flex items-center gap-2 text-indigo-900'
                      >
                        <CreditCard className='h-4 w-4 text-indigo-600' />
                        Sponsor <span className='text-red-500'>*</span>
                      </Label>
                      <Select
                        name='sponsorId'
                        value={userInfo.sponsorId}
                        onValueChange={(value) =>
                          handleChange({
                            target: { name: "sponsorId", value },
                          } as React.ChangeEvent<HTMLSelectElement>)
                        }
                      >
                        <SelectTrigger className='border-indigo-200 focus:ring-indigo-500'>
                          <SelectValue placeholder='Select Sponsor' />
                        </SelectTrigger>
                        <SelectContent>
                          {sponsors.map((sponsor, i) => (
                            <SelectItem key={i} value={sponsor._id}>
                              {sponsor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className='my-6' />

                  <div className='space-y-2'>
                    <Label
                      htmlFor='image'
                      className='flex items-center gap-2 text-indigo-900'
                    >
                      <Upload className='h-4 w-4 text-indigo-600' />
                      Student Photo
                    </Label>
                    <div className='flex items-center gap-4'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                        className='w-full md:w-auto border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
                      >
                        Upload Photo
                      </Button>
                      <input
                        id='image-upload'
                        name='image'
                        type='file'
                        accept='image/*'
                        onChange={handleChange}
                        className='hidden'
                      />
                      {userInfo.image && (
                        <div className='flex items-center gap-2'>
                          <img
                            src={
                              URL.createObjectURL(userInfo.image) ||
                              "/placeholder.svg"
                            }
                            alt='Student Photo'
                            className='h-12 w-12 rounded-full object-cover border border-indigo-200'
                          />
                          <span className='text-sm text-indigo-700'>
                            {userInfo.image.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='mt-8 mb-8 flex justify-center'>
                    <Button
                      onClick={addNewStudent}
                      disabled={isPageLoaded}
                      className='w-full md:w-1/3 bg-indigo-600 hover:bg-indigo-700 text-white'
                    >
                      {isPageLoaded ? (
                        <div className='flex items-center gap-2'>
                          <svg
                            className='animate-spin h-5 w-5'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                          >
                            <circle
                              className='opacity-25'
                              cx='12'
                              cy='12'
                              r='10'
                              stroke='currentColor'
                              strokeWidth='4'
                            ></circle>
                            <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M12 2a10 10 0 00-10 10h4a6 6 0 016-6V2z'
                            ></path>
                          </svg>
                          Processing...
                        </div>
                      ) : (
                        "Register Student"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ToastNotification />
    </div>
  );
};

export default AddStudent;
