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
    GRANTED: "text-[#4CAF50]",
    DENIED: "text-[#E14242]",
    REGISTERED: "text-[#55ACEE]",
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
    <div className='group relative rounded-xl p-6 font-montserrat bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

      <div className='relative z-10'>
        <section className='flex items-center justify-between mb-4'>
          <span className='text-[#40434F] font-bold text-sm sm:text-[16.5px]'>
            {identifier}
          </span>
          <div className='w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-white transition-colors duration-300'>
            {svg}
          </div>
        </section>

        <div
          className={`text-xs sm:text-[12px] leading-tight sm:leading-[20px] mb-4 text-[#40434F] font-semibold ${
            value === "Failed to fetch" ? "text-red-500" : ""
          }`}
        >
          {status}
        </div>

        <div className={`${baseValueStyles} ${textColor}`}>
          {formatValueText()}
        </div>
      </div>
    </div>
  );
};

export default Cards;
