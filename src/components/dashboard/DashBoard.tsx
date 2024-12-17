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

    const interval = setInterval(fetchInitialData, 6000);
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
          width='18'
          height='20'
          viewBox='0 0 18 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M9 19.0249C13.9706 19.0249 18 14.766 18 9.51245C18 4.25887 13.9706 0 9 0C4.02944 0 0 4.25887 0 9.51245C0 14.766 4.02944 19.0249 9 19.0249Z'
            fill='#4CAF50'
          />
          <path
            d='M13.5427 5.25452L7.71414 11.415L5.31414 8.87831L4.11414 10.1466L7.71414 13.9516L14.7427 6.52284L13.5427 5.25452Z'
            fill='#CCFF90'
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
          width='16'
          height='16'
          viewBox='0 0 15 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M15 3.10436L12.2896 0L7.5 5.4864L2.71003 0L0 3.10421L4.78984 8.59076L0 14.0775L2.71016 17.1818L7.5 11.6953L12.2898 17.1818L15 14.0769L10.2104 8.59076L15 3.10436Z'
            fill='#D41819'
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
          width='18'
          height='20'
          viewBox='0 0 24 25'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M19.7647 14.1819V12.7962C20.4706 12.0692 21.8216 10.7562 22.1583 9.07412C22.2586 9.12988 22.1972 9.16588 22.3087 9.16588C22.8438 9.16588 23.1953 8.472 23.1953 7.61506C23.1953 6.77223 22.7322 6.08965 22.2078 6.06847C22.3087 5.70424 22.3574 5.21718 22.3574 4.59176C22.3574 2.50518 20.5581 0 16.5318 0C12.9543 0 10.7125 2.50518 10.7125 4.59176C10.7125 5.19741 10.7485 5.69435 10.8127 6.07906C10.3207 6.15318 9.93246 6.80824 9.93246 7.61435C9.93246 8.47129 10.3659 9.16518 10.9016 9.16518C11.0125 9.16518 10.8529 9.12918 10.9525 9.07341C11.2892 10.7562 12.7059 12.0685 13.4118 12.7962V14.1C10.5882 14.4473 8.47058 15.9551 8.47058 17.4635V18.0353C8.47058 18.6085 9.05152 18.6085 9.62399 18.6085H22.8452C23.4191 18.6085 24 18.6085 24 18.0353V17.4635C24 16.0511 21.8823 14.6421 19.7647 14.1819Z'
            fill='#55ACEE'
          />
          <path
            d='M11.2941 19.8289V18.4433C12 17.7162 13.3511 16.4033 13.6878 14.7212C13.788 14.7769 13.7266 14.8129 13.8381 14.8129C14.3732 14.8129 14.7247 14.119 14.7247 13.2621C14.7247 12.4193 14.2616 11.7367 13.7372 11.7155C13.8381 11.3513 13.8868 10.8642 13.8868 10.2388C13.8868 8.15221 12.0875 5.64703 8.06118 5.64703C4.48306 5.64703 2.24188 8.15221 2.24188 10.2388C2.24188 10.8444 2.27788 11.3414 2.34212 11.7261C1.85012 11.8002 1.46188 12.4553 1.46188 13.2614C1.46188 14.1183 1.89529 14.8122 2.43106 14.8122C2.54188 14.8122 2.38235 14.7762 2.48188 14.7204C2.81859 16.4033 4.23529 17.7155 4.94118 18.4433V19.747C2.11765 20.0943 0 21.6021 0 23.1106V23.683C0 24.2555 0.580941 24.2555 1.15341 24.2555H14.3746C14.9485 24.2555 15.5294 24.2555 15.5294 23.6823V23.1099C15.5294 21.6981 13.4118 20.2892 11.2941 19.8289Z'
            fill='#226699'
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
          width='22'
          height='22'
          viewBox='0 0 28 28'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g clipPath='url(#clip0_37_940)'>
            <path
              d='M9.4745 20.2713C11.9227 18.8876 14.6878 18.1624 17.5 18.1667C20.4167 18.1667 23.1548 18.9308 25.5255 20.2713M21 11.1667C21 12.0949 20.6313 12.9852 19.9749 13.6415C19.3185 14.2979 18.4283 14.6667 17.5 14.6667C16.5717 14.6667 15.6815 14.2979 15.0251 13.6415C14.3687 12.9852 14 12.0949 14 11.1667C14 10.2384 14.3687 9.34817 15.0251 8.69179C15.6815 8.03541 16.5717 7.66667 17.5 7.66667C18.4283 7.66667 19.3185 8.03541 19.9749 8.69179C20.6313 9.34817 21 10.2384 21 11.1667ZM28 13.5C28 14.8789 27.7284 16.2443 27.2007 17.5182C26.6731 18.7921 25.8996 19.9496 24.9246 20.9246C23.9496 21.8996 22.7921 22.6731 21.5182 23.2007C20.2443 23.7284 18.8789 24 17.5 24C16.1211 24 14.7557 23.7284 13.4818 23.2007C12.2079 22.6731 11.0504 21.8996 10.0754 20.9246C9.10036 19.9496 8.32694 18.7921 7.79926 17.5182C7.27159 16.2443 7 14.8789 7 13.5C7 10.7152 8.10625 8.04451 10.0754 6.07538C12.0445 4.10625 14.7152 3 17.5 3C20.2848 3 22.9555 4.10625 24.9246 6.07538C26.8938 8.04451 28 10.7152 28 13.5Z'
              stroke='#40434F'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </g>
          <defs>
            <clipPath id='clip0_37_940'>
              <rect width='28' height='28' fill='white' />
            </clipPath>
          </defs>
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

      <div className='mb-8 flex flex-col sm:w-full sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
        <div className='w-full sm:w-3/5'>
          <label
            htmlFor='datePicker'
            className='block text-sm font-medium text-gray-700'
          >
            Search by Date
          </label>
          <input
            id='datePicker'
            type='date'
            className='input input-bordered w-full sm:max-w-xs max-w-full mt-2'
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
          />
        </div>

        <button className='btn bg-blue-500 text-white hidden sm:block w-full sm:w-[120px] py-2 mt-4 sm:mt-0'>
          Search
        </button>
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

      <div className=' mt-5 flex flex-col gap-4  md:flex md:flex-row   md:gap-4 lg:gap-8 lg:flex lg:mt-24 lg:flex-row md:mt-24  '>
        <DashboardGraph />
        <Calender />
      </div>
    </div>
  );
};

export default DashBoard;
