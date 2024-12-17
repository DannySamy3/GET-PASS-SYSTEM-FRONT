"use client";

import React, { useEffect, useState } from "react";
import Cards from "../cards/Cards";
import { getOrdinalSuffix, getCurrentDate } from "@/utils/helper";
import {
  getAllStudent,
  getRegisteredStudents,
} from "@/utils/studentController";
import { getScanInfo } from "@/utils/scanController";
import { DashboardGraph } from "../graphs/DashboardGraph";
import Calender from "@/components/calender/Calender";

import "react-toastify/dist/ReactToastify.css";
import "react-calendar/dist/Calendar.css";

const DashBoard = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dashData, setDashData] = useState({
    registered: "",
    granted: "",
    denied: "",
    fullPaid: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      const currentDate = getCurrentDate();

      try {
        const [allStudents, fundedStudents, scanInfo] = await Promise.all([
          getAllStudent(),
          getRegisteredStudents(),
          getScanInfo(currentDate),
        ]);

        setDashData({
          registered: allStudents.data.data.total,
          fullPaid: fundedStudents.data.studentNumber,
          granted: scanInfo?.data.granted,
          denied: scanInfo?.data.denied,
        });

        setSelectedDate(new Date(currentDate));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInitialData();

    const interval = setInterval(fetchInitialData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDateChange = async (event: any) => {
    const date = event.target.value;
    setSelectedDate(new Date(date));

    try {
      const scanInfo = await getScanInfo(date);
      setDashData((prev) => ({
        ...prev,
        granted: scanInfo?.data.granted,
        denied: scanInfo?.data.denied,
      }));
    } catch (error) {
      console.error("Error fetching scan info:", error);
    }
  };

  const handleCardClick = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const currentDay = new Date();
  const formattedDate = `${currentDay.getDate()}${getOrdinalSuffix(
    currentDay.getDate()
  )} ${currentDay.toLocaleString("default", {
    month: "long",
  })} ${currentDay.getFullYear()}`;

  const cards = [
    {
      identifier: "GRANTED",
      status: dashData.granted >= "0" ? "UP TO DATE." : "NETWORK ERROR...",
      value: dashData.granted >= "0" ? dashData.granted : "Failed to fetch",
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 12l2 2 4-4M12 6.75v4.5m0 6.75v.008M3 12a9 9 0 1118 0 9 9 0 01-18 0z'
          />
        </svg>
      ),
    },
    {
      identifier: "DENIED",
      status: dashData.denied >= "0" ? "UPDATES SYNCED" : "NETWORK ERROR...",
      value: dashData.denied >= "0" ? dashData.denied : "Failed to fetch",
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 9v3.75M12 15.75h.008M12 3a9 9 0 100 18 9 9 0 000-18z'
          />
        </svg>
      ),
    },
    {
      identifier: "REGISTERED",
      status: dashData.registered ? "FOUND" : "NETWORK ERROR...",
      value: dashData.registered ? +dashData.registered : "Failed to fetch",
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15 12H9m4 8.25c-.5.25-1.1.4-1.5.4a7.5 7.5 0 117.5-7.5c0 .4-.1 1-.4 1.5'
          />
        </svg>
      ),
    },
    {
      identifier: "FULLY PAID",
      status: dashData.fullPaid ? "FOUND" : "NETWORK ERROR...",
      value: dashData.fullPaid ? +dashData.fullPaid : "Failed to fetch",
      svg: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3v1.5M16.25 8.75l-2.5 2.5m-3.5 2.5L7.5 14m2-11.5h5M2.75 12a9.25 9.25 0 1018.5 0 9.25 9.25 0 00-18.5 0z'
          />
        </svg>
      ),
    },
  ];

  return (
    <div className='w-full max-w-full px-4 sm:px-6'>
      <section className='flex flex-col sm:flex-row mb-7 items-center justify-between p-4 border-2 border-gray-300 rounded-lg'>
        <h2 className='text-gray-600 font-medium text-base sm:text-lg mb-2 sm:mb-0'>
          DashBoard
        </h2>
        <p className='text-gray-500 font-semibold text-sm sm:text-base'>
          {formattedDate}
        </p>
      </section>

      <div className='mb-8 flex justify-between items-center'>
        <div className='w-3/5'>
          <label
            htmlFor='datePicker'
            className='block text-sm font-medium text-gray-700'
          >
            Search by Date
          </label>
          <input
            id='datePicker'
            type='date'
            className='input input-bordered w-full max-w-xs mt-2'
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
          />
        </div>

        <button className='btn bg-blue-500 text-white w-[10%]'>Search</button>
      </div>

      <div className='hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 place-items-center'>
        {cards.map((card, index) => (
          <div className='w-full cursor-pointer' key={index}>
            <Cards
              identifier={card.identifier}
              status={card.status}
              value={card.value}
              svg={card.svg}
            />
          </div>
        ))}
      </div>

      <div className='sm:hidden'>
        <div className='w-full cursor-pointer' onClick={handleCardClick}>
          <Cards
            identifier={cards[currentCardIndex].identifier}
            status={cards[currentCardIndex].status}
            value={cards[currentCardIndex].value}
            svg={cards[currentCardIndex].svg}
          />
        </div>
      </div>

      <div className='flex gap-8 mt-24 items-end'>
        <DashboardGraph />
        <Calender />
      </div>
    </div>
  );
};

export default DashBoard;
