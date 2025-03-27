import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper function to get month name
  const getMonthName = (date: any) => {
    return date.toLocaleString("default", { month: "long" });
  };

  // Generate days for the current month
  const generateCalendarDays = (date: any) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get first day of the month
    const firstDay = new Date(year, month, 1);

    // Get last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Determine start of calendar (previous month's days)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // Determine end of calendar (next month's days)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days = [];
    const currentDay = new Date(startDate);

    while (currentDay <= endDate) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  // Navigate between months
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Check if a date is today
  const isToday = (date: any) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is in the current month
  const isSameMonth = (date: any, referenceDate: any) => {
    return (
      date.getMonth() === referenceDate.getMonth() &&
      date.getFullYear() === referenceDate.getFullYear()
    );
  };

  const days = generateCalendarDays(currentDate);

  return (
    <div className='w-full h-full flex flex-col'>
      {/* Month Navigation */}
      <div className='flex justify-between items-center mb-2'>
        <button
          onClick={goToPreviousMonth}
          className='p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900'
        >
          <ChevronLeft className='h-3 w-3' />
        </button>
        <div className='text-xs font-semibold text-gray-800'>
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </div>
        <button
          onClick={goToNextMonth}
          className='p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900'
        >
          <ChevronRight className='h-3 w-3' />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className='grid grid-cols-7 text-center mb-1'>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className='text-[9px] font-medium text-gray-500 uppercase'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className='grid grid-cols-7 gap-0.5 flex-1'>
        {days.map((day) => {
          const today = isToday(day);
          const sameMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              className={`
                aspect-square
                flex
                items-center
                justify-center
                text-[10px]
                font-medium
                transition-colors
                duration-200
                cursor-pointer
                rounded-sm
                ${
                  today
                    ? "bg-indigo-600 text-white font-bold"
                    : sameMonth
                    ? "text-gray-800 hover:bg-indigo-50 hover:text-indigo-600"
                    : "text-gray-400 hover:bg-gray-50"
                }
              `}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
