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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      formData.append(key, userInfo[key as keyof UserInfo] as any);
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
    <div className='min-h-screen w-full py-8'>
      <Tabs defaultValue='sponsors' className='w-full'>
        <div className='px-1'>
          <div className='flex justify-between items-center bg-gray-100 text-gray-500 py-4 px-6 rounded-lg shadow-md border border-gray-300'>
            <h1 className='text-2xl text-gray-600 font-bold tracking-tight'>
              Add Student
            </h1>
          </div>
        </div>
        <TabsContent value='sponsors' className='mt-8 px-1'>
          <Card className='h-[calc(100vh-10rem)] w-full shadow-lg rounded-none border-0'>
            <CardContent className='p-6 h-[calc(100vh-14rem)] overflow-y-auto'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='firstName'
                    className='flex items-center gap-2'
                  >
                    <User className='h-4 w-4' />
                    First Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='firstName'
                    name='firstName'
                    value={userInfo.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter student's first name"
                  />
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='secondName'
                    className='flex items-center gap-2'
                  >
                    <User className='h-4 w-4' />
                    Middle Name <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='secondName'
                    name='secondName'
                    value={userInfo.secondName}
                    onChange={handleChange}
                    required
                    placeholder="Enter student's middle name"
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='lastName' className='flex items-center gap-2'>
                    <User className='h-4 w-4' />
                    Surname <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='lastName'
                    name='lastName'
                    value={userInfo.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter student's last name"
                  />
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='nationality'
                    className='flex items-center gap-2'
                  >
                    <Flag className='h-4 w-4' />
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
                    <SelectTrigger>
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
                  <Label htmlFor='gender' className='flex items-center gap-2'>
                    <Users className='h-4 w-4' />
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
                    <SelectTrigger>
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
                    className='flex items-center gap-2'
                  >
                    <Phone className='h-4 w-4' />
                    Phone Number <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='phoneNumber'
                    name='phoneNumber'
                    value={userInfo.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder='Enter an active mobile number'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email' className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
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
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='classId' className='flex items-center gap-2'>
                    <Book className='h-4 w-4' />
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
                    <SelectTrigger>
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
                    className='flex items-center gap-2'
                  >
                    <CreditCard className='h-4 w-4' />
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
                    <SelectTrigger>
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
                      className='flex items-center gap-2'
                    >
                      <DollarSign className='h-4 w-4' />
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
                    />
                  </div>
                )}

                {showFundedAmount && selectedClass?.tuitionFee && (
                  <div className='space-y-2'>
                    <Label className='flex items-center gap-2'>
                      <DollarSign className='h-4 w-4' />
                      Remaining Amount
                    </Label>
                    <div className='flex items-center h-10 px-3 rounded-md border border-input bg-background text-sm'>
                      {remainingAmount.toFixed(2)}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Total Tuition Fee: {selectedClass.tuitionFee.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <Separator className='my-6' />

              <div className='space-y-2'>
                <Label htmlFor='image' className='flex items-center gap-2'>
                  <Upload className='h-4 w-4' />
                  Student Photo
                </Label>
                <div className='flex items-center gap-4'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    className='w-full md:w-auto'
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
                        className='h-12 w-12 rounded-full object-cover border'
                      />
                      <span className='text-sm text-muted-foreground'>
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
                  className='w-full md:w-1/3 bg-blue-500  '
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
