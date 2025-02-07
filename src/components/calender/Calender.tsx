import React, { useState } from "react";

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
    <div className='w-[100%] lg:w-[30%] md:w-[45%]  lg:mt-0 md:mt-0  h-[330px] md:h-[380px]  lg:mb-3 bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden font-montserrat'>
      {/* Month Navigation */}
      <div className='flex justify-between items-center p-4 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700'>
        <button
          onClick={goToPreviousMonth}
          className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors'
        >
          ◀
        </button>
        <div className='text-xl font-semibold text-gray-800 dark:text-white'>
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </div>
        <button
          onClick={goToNextMonth}
          className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors'
        >
          ▶
        </button>
      </div>

      {/* Weekday Headers */}
      <div className='grid grid-cols-7 text-center bg-gray-100   dark:bg-neutral-800 py-2'>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className='grid grid-cols-7 gap-1 p-2'>
        {days.map((day) => {
          const today = isToday(day);
          const sameMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toString()}
              className={`
                  text-center 
                  p-2 
                  rounded-lg 
                  text-sm 
                  font-medium 
                  transition-colors 
                  duration-200
                  cursor-pointer
                  ${
                    today
                      ? "bg-blue-500 text-white font-bold"
                      : sameMonth
                      ? "text-gray-800 dark:text-white hover:bg-blue-100 dark:hover:bg-neutral-700"
                      : "text-gray-400 dark:text-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-800"
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
