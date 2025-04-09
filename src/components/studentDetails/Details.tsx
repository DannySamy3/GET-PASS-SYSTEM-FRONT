"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { getStudentById, editStudent } from "@/utils/studentController";
import { getClassById } from "@/utils/classController";
import { getSponsorById } from "@/utils/sponsorController";
import { getstudentPayment } from "@/utils/paymentController";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import { FaPencilAlt, FaMoneyBillWave, FaSave, FaTimes } from "react-icons/fa";
import { editImage } from "@/utils/imageController";
import { getAllPaymentSessions } from "@/utils/paymentSessionController";

interface Props {
  id: any;
  setView: any;
  setDate: any;
}

// Define payment session types
interface PaymentSession {
  _id?: string;
  sessionName: string;
  startDate: string;
  endDate: string;
  amount: number;
  activeStatus?: boolean;
  grace?: boolean;
  gracePeriodDays?: number;
  graceRemainingDays?: number;
}

// Define payment response types
interface Payment {
  _id: string;
  amount: number;
  sessionId: PaymentSession;
  studentId: any;
  paymentStatus: string;
  remainingAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface PaymentResponse {
  status: string;
  results: number;
  data: {
    payments: Payment[];
  };
}

export const Details: React.FC<Props> = ({ id, setView, setDate }) => {
  const [student, setStudent] = useState<any>();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [activeSession, setActiveSession] = useState<PaymentSession | null>(
    null
  );

  const dispatch = useDispatch();

  const fetchActiveSession = async () => {
    try {
      const response = await getAllPaymentSessions();
      if (response?.data?.data) {
        // @ts-ignore
        const sessions = response.data.data.sessions;
        const active = sessions.find(
          (session: PaymentSession) => session.activeStatus === true
        );
        if (active) {
          setActiveSession(active);
          const remainingAmount = active.amount - balance;
          setPaymentAmount(remainingAmount.toString());
        }
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      console.error("Error fetching active session:", err);
      dispatch(
        showToast({
          message:
            err.response?.data?.message || "Failed to fetch active session",
          type: "error",
        })
      );
    }
  };

  const getDetails = async () => {
    try {
      const result = await getStudentById(id);

      if (result) {
        // @ts-ignore
        const classData = await getClassById(result?.data.student.classId);
        // @ts-ignore
        const sponsorData = await getSponsorById(result?.data.student.sponsor);

        setStudent({
          // @ts-ignore
          ...result.data.student,
          // @ts-ignore
          className: classData.data.name,
          // @ts-ignore
          sponsorName: sponsorData?.data.data.name,
        });

        // Fetch active session and student payment
        try {
          const response = await getAllPaymentSessions();
          if (response?.data?.data) {
            // @ts-ignore
            const sessions = response.data.data.sessions;
            const active = sessions.find(
              (session: PaymentSession) => session.activeStatus === true
            );
            if (active) {
              setActiveSession(active);

              // Fetch student payment for the current session
              try {
                console.log(
                  "Student ID being passed to getstudentPayment:",
                  id
                );
                const paymentResponse = (await getstudentPayment(
                  id
                )) as PaymentResponse;

                // console.log("Payment response:", paymentResponse);

                // Extract payment data from the response structure
                const payments = paymentResponse?.data?.payments || [];
                const currentPayment = payments.length > 0 ? payments[0] : null;

                // Set the funded amount from the payment data
                const fundedAmount = currentPayment?.amount || 0;
                setBalance(fundedAmount);

                const remainingAmount = active.amount - fundedAmount;
                setPaymentAmount(remainingAmount.toString());
              } catch (paymentError) {
                console.error("Error fetching student payment:", paymentError);
                // If payment fetch fails, set balance to 0
                setBalance(0);
                const remainingAmount = active.amount;
                setPaymentAmount(remainingAmount.toString());
              }
            }
          }
        } catch (error) {
          const err = error as { response: { data: { message: string } } };
          console.error("Error fetching active session:", err);
          dispatch(
            showToast({
              message:
                err.response?.data?.message || "Failed to fetch active session",
              type: "error",
            })
          );
        }
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
    if (!activeSession || !paymentAmount) {
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
      sessionId: activeSession._id,
      amount: parseFloat(paymentAmount),
      paymentType: paymentType,
    });

    dispatch(
      showToast({
        message: "Payment recorded successfully",
        type: "success",
      })
    );

    // Reset payment form
    setPaymentAmount("");
    setPaymentType("");
    setShowPaymentOptions(false);

    // Refresh student details to update payment information
    getDetails();
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
      fetchActiveSession();
      // Set payment amount to the remaining amount
      if (activeSession?.amount) {
        const remainingAmount = activeSession.amount - balance;
        setPaymentAmount(remainingAmount.toString());
      }
    } else {
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
  }, [id]);

  useEffect(() => {
    if (showPaymentOptions) {
      fetchActiveSession();
    }
  }, [showPaymentOptions]);

  useEffect(() => {
    if (activeSession) {
      getDetails();
    }
  }, [activeSession]);

  // console.log("...........", student);

  return (
    <div className='min-h-screen w-full font-montserrat p-4'>
      <div
        className={`bg-white shadow-lg rounded-lg p-4 md:p-8 w-full ${
          showPaymentOptions ? "max-h-[90vh] overflow-y-auto" : ""
        }`}
      >
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-700'>
            Student Details
          </h2>
          <div className='flex flex-col sm:flex-row gap-2 w-full md:w-auto'>
            <button
              onClick={() => {
                setView((prev: any) => ({ ...prev, view: false }));
                setDate(false);
              }}
              className='w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2'
            >
              <FaTimes /> Cancel
            </button>

            {!isPaymentDisabled() && (
              <button
                onClick={togglePaymentOptions}
                className={`w-full sm:w-auto px-4 py-2 ${
                  showPaymentOptions
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white rounded-md transition-colors flex items-center justify-center gap-2`}
              >
                <FaMoneyBillWave />{" "}
                {showPaymentOptions ? "Cancel Payment" : "Payment"}
              </button>
            )}
          </div>
        </div>

        {/* Student Image Section */}
        <div className='flex flex-col md:flex-row justify-center items-center my-6 relative gap-4'>
          {student?.image ? (
            <div className='flex flex-col md:flex-row items-center gap-4 relative'>
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
              <div className='text-center md:text-left'>
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
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <label className='text-sm text-gray-600 font-medium'>
              Full Name
            </label>
            <p className='text-base font-semibold text-gray-800 break-words'>{`${
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
            <p className='text-base font-semibold text-gray-800 break-words'>
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

          <div className='bg-gray-50 p-4 rounded-lg sm:col-span-2'>
            <label className='text-sm text-gray-600 font-medium'>
              Registration Status
            </label>
            <div>
              <p className='text-sm text-gray-500 mb-2'>
                Amount Paid: TSH {balance.toLocaleString()}
              </p>
              <p className='text-sm text-gray-500 mb-2'>
                Remaining Amount: TSH{" "}
                {activeSession?.amount
                  ? (activeSession.amount - balance).toLocaleString()
                  : "0"}
              </p>
              {student?.status === "REGISTERED" &&
                activeSession?.amount &&
                activeSession.amount - balance > 0 &&
                activeSession?.grace && (
                  <p className='text-sm text-amber-600 mb-2'>
                    Status: Grace Period Active (
                    {activeSession.graceRemainingDays} days remaining)
                  </p>
                )}
              <p
                className={`text-base font-semibold ${
                  student?.status === "NOT REGISTERED"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {student?.status}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Options Section */}
        {showPaymentOptions && (
          <div className='mt-4 p-4 md:p-6 bg-gray-50 rounded-lg border border-gray-200'>
            <h3 className='text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2'>
              <FaMoneyBillWave className='text-blue-500' />
              Payment Details
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
              <div className='space-y-6'>
                {activeSession && (
                  <>
                    <div className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Current Session
                          </label>
                          <div className='bg-blue-50 p-3 rounded-md border border-blue-100'>
                            <p className='font-medium text-gray-800 text-lg'>
                              {activeSession.sessionName}
                            </p>
                            <p className='text-sm text-blue-600 mt-1 font-medium'>
                              Required Amount: TSH{" "}
                              {activeSession?.amount
                                ? (
                                    activeSession.amount - balance
                                  ).toLocaleString()
                                : "0"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Payment Amount
                          </label>
                          <div className='relative'>
                            <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                              TSH
                            </span>
                            <input
                              type='number'
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              placeholder='Enter amount'
                              className='w-full pl-8 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium'
                            />
                          </div>
                          <p className='text-sm text-gray-500 mt-2'>
                            Pay the remaining amount to get registered
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='flex justify-end mt-6'>
                      <button
                        onClick={handlePaymentSubmit}
                        className='w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-base font-medium shadow-sm'
                      >
                        <FaSave /> Submit Payment
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
