import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <UICard className='border-slate-200 shadow-md h-full'>
      <CardHeader className='bg-gradient-to-r from-indigo-50 via-blue-50 to-white text-indigo-900 rounded-t-lg border-b border-slate-200'>
        <CardTitle className='text-lg'>Calendar</CardTitle>
        <CardDescription className='text-indigo-700'>
          View and track important dates
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-2'>
        <div className='w-full h-full flex flex-col'>
          {/* Month Navigation */}
          <div className='flex justify-between items-center mb-1'>
            <button
              onClick={goToPreviousMonth}
              className='p-0.5 rounded-full hover:bg-indigo-50 transition-colors text-indigo-600 hover:text-indigo-900'
            >
              <ChevronLeft className='h-3 w-3' />
            </button>
            <div className='text-xs font-semibold text-indigo-900'>
              {getMonthName(currentDate)} {currentDate.getFullYear()}
            </div>
            <button
              onClick={goToNextMonth}
              className='p-0.5 rounded-full hover:bg-indigo-50 transition-colors text-indigo-600 hover:text-indigo-900'
            >
              <ChevronRight className='h-3 w-3' />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className='grid grid-cols-7 text-center mb-1'>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className='text-[10px] font-medium text-indigo-600 uppercase'
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className='grid grid-cols-7 gap-1.5 flex-1 min-h-0 p-1'>
            {days.map((day) => {
              const today = isToday(day);
              const sameMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toString()}
                  className={`
                    w-full
                    h-full
                    min-h-[20px]
                    flex
                    items-center
                    justify-center
                    text-[15px]
                    font-medium
                    transition-colors
                    duration-200
                    cursor-pointer
                    rounded-sm
                    p-1
                    ${
                      today
                        ? "bg-indigo-600 text-white font-bold"
                        : sameMonth
                        ? "text-indigo-900 hover:bg-indigo-50 hover:text-indigo-600"
                        : "text-indigo-400 hover:bg-indigo-50/50"
                    }
                  `}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </UICard>
  );
};

export default Calendar;
