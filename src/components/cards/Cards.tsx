import React from "react";

interface CardProps {
  identifier: string;
  status: string;
  value: any;
  svg: React.ReactNode;
}

const Cards: React.FC<CardProps> = ({ identifier, status, value, svg }) => {
  const baseValueStyles =
    "flex items-center gap-2 font-bold text-3xl sm:text-[42px] leading-tight sm:leading-[51.2px]";

  const identifierColors: Record<string, string> = {
    GRANTED: "text-[#9A1BA0]",
    DENIED: "text-[#E14242]",
    REGISTERED: "text-[#AFA939]",
    "FULLY PAID": "text-[#40434F]",
    default: "text-[#FFCC33]",
  };

  const textColor = identifierColors[identifier] || identifierColors.default;

  const formatValueText = () => {
    if (value === "Failed to fetch") {
      return (
        <span className='text-[#40434F] text-[23px] text-center'>{value}</span>
      );
    }
    return (
      <>
        <span>{value}</span>
        <span className='text-[#101010] text-[10px] sm:text-[12px] font-semibold ml-1 sm:mt-2'>
          {value > 1 ? "Students" : "Student"}
        </span>
      </>
    );
  };

  return (
    <div className='rounded-xl pt-4 pb-4 px-5 sm:px-6 font-montserrat bg-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 w-full h-[140px] sm:h-[160px]'>
      <section className='flex items-center justify-between mb-2'>
        <span className='text-[#40434F] font-bold text-sm sm:text-[16.5px]'>
          {identifier}
        </span>
        <div className='w-6 h-6 sm:w-auto sm:h-auto'>{svg}</div>
      </section>
      <div
        className={`text-xs sm:text-[12px] leading-tight sm:leading-[20px] mb-2 sm:my-3 text-[#40434F] font-semibold ${
          value === "Failed to fetch" ? "text-red-500" : ""
        }`}
      >
        {status}
      </div>
      <div className={`${baseValueStyles} ${textColor}`}>
        {formatValueText()}
      </div>
    </div>
  );
};

export default Cards;
