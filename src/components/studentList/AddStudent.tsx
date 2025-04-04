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
  fundedAmount?: number;
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

export const AddStudent = () => {
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
    fundedAmount: 0,
  });

  const [sponsors, setSponsors] = useState<SponsorInfo[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(false);
  const [isToastShown, setIsToastShown] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [showFundedAmount, setShowFundedAmount] = useState<boolean>(false);

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
    } else if (name === "fundedAmount") {
      const fundedAmount = Number.parseFloat(value) || 0;
      setUserInfo((prev) => ({
        ...prev,
        fundedAmount,
      }));

      // Calculate remaining amount
      if (selectedClass && selectedClass.tuitionFee) {
        const remaining = selectedClass.tuitionFee - fundedAmount;
        setRemainingAmount(remaining > 0 ? remaining : 0);
      }
    } else {
      setUserInfo((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Handle sponsor selection
      if (name === "sponsorId") {
        const selectedSponsor = sponsors.find(
          (sponsor) => sponsor._id === value
        );

        // Show funded amount field for all sponsors EXCEPT METFUND and Private
        setShowFundedAmount(
          selectedSponsor ? selectedSponsor.name !== "Metfund" : false
        );

        // Reset funded amount when switching to METFUND or Private
        if (
          selectedSponsor &&
          (selectedSponsor.name === "METFUND" ||
            selectedSponsor.name === "Private")
        ) {
          setUserInfo((prev) => ({ ...prev, fundedAmount: 0 }));
        }
      }

      // Handle class selection
      if (name === "classId") {
        const selected = classes.find((cls) => cls._id === value) || null;
        setSelectedClass(selected);

        // Recalculate remaining amount when class changes
        if (selected && selected.tuitionFee && userInfo.fundedAmount) {
          const remaining = selected.tuitionFee - userInfo.fundedAmount;
          setRemainingAmount(remaining > 0 ? remaining : 0);
        }
      }
    }
  };

  const addNewStudent = async () => {
    const currentYear = new Date().getFullYear().toString();
    userInfo.enrollmentYear = currentYear;

    const formData = new FormData();
    Object.keys(userInfo).forEach((key) => {
      const value = userInfo[key as keyof UserInfo];
      // Handle fundedAmount specifically
      if (key === "fundedAmount") {
        formData.append(key, value?.toString() || "0");
      } else if (key === "image" && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value as string);
      }
    });

    setIsPageLoaded(true);
    try {
      const response = (await addStudent(formData)) as AddStudentResponse;
      if (response.data) {
        dispatch(
          showToast({ message: "Student added successfully!", type: "success" })
        );

        setIsToastShown(true);
        setIsPageLoaded(false);

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
          fundedAmount: 0,
        });

        router.push("/");
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
      setIsPageLoaded(false);
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
        fundedAmount: 0,
      });
    }
  };

  useEffect(() => {
    handleFetchSponsor();
    handleFetchClasses();
  }, []);

  return (
    <div className='min-h-screen w-full py-4'>
      <Tabs defaultValue='sponsors' className='w-full'>
        <TabsContent value='sponsors' className='px-1'>
          <Card className='w-full shadow-md rounded-lg border-slate-200'>
            <CardHeader className='bg-gradient-to-r from-indigo-50 via-blue-50 to-white text-indigo-900 rounded-t-lg border-b border-slate-200'>
              <CardTitle>Add New Student</CardTitle>
              <CardDescription className='text-indigo-700'>
                Fill in the student's information below
              </CardDescription>
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

                {showFundedAmount && (
                  <div className='space-y-2'>
                    <Label
                      htmlFor='fundedAmount'
                      className='flex items-center gap-2 text-indigo-900'
                    >
                      <DollarSign className='h-4 w-4 text-indigo-600' />
                      Funded Amount <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                      id='fundedAmount'
                      name='fundedAmount'
                      type='number'
                      value={userInfo.fundedAmount?.toString() || "0"}
                      onChange={handleChange}
                      required
                      placeholder='Enter amount funded by sponsor'
                      className='border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500'
                    />
                  </div>
                )}

                {showFundedAmount && selectedClass?.tuitionFee && (
                  <div className='space-y-2'>
                    <Label className='flex items-center gap-2 text-indigo-900'>
                      <DollarSign className='h-4 w-4 text-indigo-600' />
                      Remaining Amount
                    </Label>
                    <div className='flex items-center h-10 px-3 rounded-md border border-indigo-200 bg-white text-sm text-indigo-900'>
                      {remainingAmount.toFixed(2)}
                    </div>
                    <p className='text-xs text-indigo-700'>
                      Total Tuition Fee: {selectedClass.tuitionFee.toFixed(2)}
                    </p>
                  </div>
                )}
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

              <div className='mt-8 flex justify-center'>
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
  );
};

export default AddStudent;
