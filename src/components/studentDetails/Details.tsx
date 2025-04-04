"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { getStudentById, editStudent } from "@/utils/studentController";
import { getClassById } from "@/utils/classController";
import { getSponsorById } from "@/utils/sponsorController";
import { getPaymentById } from "@/utils/paymentController";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import { FaPencilAlt, FaMoneyBillWave, FaSave, FaTimes } from "react-icons/fa";
import { editImage } from "@/utils/imageController";

interface Props {
  id: any;
  setView: any;
  setDate: any;
}

// Define payment session types
interface PaymentSession {
  id: string;
  name: string;
}

export const Details: React.FC<Props> = ({ id, setView, setDate }) => {
  const [student, setStudent] = useState<any>();
  const [selectStatus, setSelectStatus] = useState("");
  const [edit, setEdit] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);

  // Mock payment sessions - replace with actual data from your API
  const [paymentSessions, setPaymentSessions] = useState<PaymentSession[]>([
    { id: "1", name: "First Term Fees" },
    { id: "2", name: "Second Term Fees" },
    { id: "3", name: "Third Term Fees" },
    { id: "4", name: "Examination Fees" },
    { id: "5", name: "Library Fees" },
  ]);

  const dispatch = useDispatch();

  const getDetails = async () => {
    try {
      const result = await getStudentById(id);

      console.log("...........", result);

      if (result) {
        // @ts-ignore
        const classData = await getClassById(result?.data.student.classId);
        // @ts-ignore
        const sponsorData = await getSponsorById(result?.data.student.sponsor);
        // @ts-ignore
        const paymentData = await getPaymentById(result?.data.student._id);
        console.log("Payment Data:", paymentData);

        setStudent({
          // @ts-ignore
          ...result.data.student,
          // @ts-ignore
          className: classData.data.name,
          // @ts-ignore
          sponsorName: sponsorData?.data.data.name,
        });

        // @ts-ignore
        setBalance(paymentData?.data?.data?.balance || 0);
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("File size (MB):", file.size / (1024 * 1024));
      if (file.size > 50 * 1024 * 1024) {
        dispatch(
          showToast({
            message: "File is too large! Maximum size is 50MB.",
            type: "error",
          })
        );
        return;
      }

      const previousImageUrl = student.image;

      try {
        const result = await editImage(file, previousImageUrl, student._id);

        setStudent((prev: any) => ({
          ...prev,
          //@ts-ignore
          image: result.imageUrl,
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
    }
  };

  const handlePaymentSubmit = () => {
    // Implement your payment submission logic here
    if (!selectedSession || !paymentAmount) {
      dispatch(
        showToast({
          message: "Please select a session and enter payment amount",
          type: "error",
        })
      );
      return;
    }

    // Mock API call - replace with your actual payment API
    console.log("Payment submitted:", {
      studentId: student?._id,
      sessionId: selectedSession,
      amount: paymentAmount,
      paymentType: paymentType,
    });

    dispatch(
      showToast({
        message: "Payment recorded successfully",
        type: "success",
      })
    );

    // Reset payment form
    setSelectedSession("");
    setPaymentAmount("");
    setPaymentType("");
    setShowPaymentOptions(false);
    setEdit(false);
  };

  const togglePaymentOptions = () => {
    // Don't show payment options for restricted sponsors
    if (student?.sponsorName === "Metfund") {
      dispatch(
        showToast({
          message:
            "Payment options not available for Metfund sponsored students",
          type: "success",
        })
      );
      return;
    }

    setShowPaymentOptions(!showPaymentOptions);
    if (!showPaymentOptions) {
      setEdit(true);
    } else {
      setSelectedSession("");
      setPaymentAmount("");
      setPaymentType("");
    }
  };

  const isPaymentDisabled = () => {
    return (
      student?.sponsorName === "Metfund" || student?.sponsorName === "Hesbl"
    );
  };

  useEffect(() => {
    getDetails();
  }, [student?.status]);

  console.log("...........", student);

  return (
    <div className='h-[80vh] font-montserrat'>
      <div className='bg-white shadow-lg rounded-lg p-8 w-full'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-3xl font-bold text-gray-700'>Student Details</h2>
          <div className='flex space-x-4'>
            <button
              onClick={() => {
                setView((prev: any) => ({ ...prev, view: false }));
                setDate(false);
              }}
              className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2'
            >
              <FaTimes /> Cancel
            </button>

            {!showPaymentOptions && (
              <button
                onClick={() => {
                  setEdit((prev) => !prev);
                }}
                className={`px-4 py-2 ${
                  edit
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded-md transition-colors flex items-center gap-2`}
              >
                {edit ? <FaSave /> : <FaPencilAlt />} {edit ? "Save" : "Edit"}
              </button>
            )}

            {!isPaymentDisabled() && (
              <button
                onClick={togglePaymentOptions}
                className={`px-4 py-2 ${
                  showPaymentOptions
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded-md transition-colors flex items-center gap-2`}
              >
                <FaMoneyBillWave />{" "}
                {showPaymentOptions ? "Cancel Payment" : "Payment"}
              </button>
            )}
          </div>
        </div>

        {/* Student Image Section */}
        <div className='flex justify-center my-6 relative'>
          {student?.image ? (
            <div className='flex items-center gap-4 relative'>
              <div className='relative'>
                <img
                  src={student.image || "/placeholder.svg"}
                  alt='Student'
                  className='h-32 w-32 rounded-full object-cover border-4 border-gray-200'
                />
                <input
                  type='file'
                  id='image-upload'
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <label
                  htmlFor='image-upload'
                  className='absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors'
                >
                  <FaPencilAlt className='text-gray-600' />
                </label>
              </div>
              <div>
                <h3 className='text-xl font-bold text-gray-800'>{`${
                  student?.firstName ?? ""
                } ${student?.lastName ?? ""}`}</h3>
                <p className='text-gray-600'>{student?.regNo}</p>
              </div>
            </div>
          ) : (
            <div className='h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500'></div>
            </div>
          )}
        </div>

        {/* Student Details Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm text-gray-600 font-medium'>
              Full Name
            </label>
            <p className='text-base font-semibold text-gray-800'>{`${
              student?.firstName ?? ""
            } ${student?.secondName ?? ""} ${student?.lastName ?? ""}`}</p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm text-gray-600 font-medium'>Gender</label>
            <p className='text-base font-semibold text-gray-800'>
              {student?.gender}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm text-gray-600 font-medium'>Email</label>
            <p className='text-base font-semibold text-gray-800'>
              {student?.email}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm text-gray-600 font-medium'>
              Phone Number
            </label>
            <p className='text-base font-semibold text-gray-800'>
              {student?.phoneNumber}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm text-gray-600 font-medium'>
              Nationality
            </label>
            <p className='text-base font-semibold text-gray-800'>
              {student?.nationality}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm text-gray-600 font-medium'>Class</label>
            <p className='text-base font-semibold text-gray-800'>
              {student?.className}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm text-gray-600 font-medium'>
              Registration Number
            </label>
            <p className='text-base font-semibold text-gray-800'>
              {student?.regNo}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm text-gray-600 font-medium'>Sponsor</label>
            <p className='text-base font-semibold text-gray-800'>
              {student?.sponsorName}
            </p>
          </div>

          <div className='bg-gray-50 p-4 rounded-lg col-span-1'>
            <label className='text-sm text-gray-600 font-medium'>
              {edit && student?.sponsorName !== "Metfund"
                ? "Add Payment"
                : "Registration Status"}
            </label>
            {edit && student?.sponsorName !== "Metfund" ? (
              <div>
                <p className='text-sm text-gray-500 mb-2'>
                  Current Balance: ${balance}
                </p>
                <input
                  type='number'
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder='Enter payment amount'
                  className='mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>
            ) : (
              <p
                className={`text-base font-semibold ${
                  student?.status === "NOT REGISTERED"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {student?.status}
              </p>
            )}
          </div>
        </div>

        {/* Payment Options Section - Moved to bottom */}
        {showPaymentOptions && (
          <div className='mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-700 mb-4'>
              Payment Options
            </h3>

            {student?.sponsorName === "Hesbl" ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Payment Type
                  </label>
                  <select
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  >
                    <option value=''>Select Payment Type</option>
                    <option value='full'>Full Payment</option>
                    <option value='partial'>Partial Payment</option>
                  </select>
                </div>

                {paymentType && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Payment Amount
                    </label>
                    <input
                      type='number'
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder='Enter amount'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Select Session
                  </label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  >
                    <option value=''>Select Payment Session</option>
                    {paymentSessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSession && (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Payment Amount
                    </label>
                    <input
                      type='number'
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder='Enter amount'
                      className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    />
                  </div>
                )}
              </div>
            )}

            <div className='mt-6 flex justify-end'>
              <button
                onClick={handlePaymentSubmit}
                className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2'
              >
                <FaSave /> Submit Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
