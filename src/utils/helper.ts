import axiosInstance from "./axioInstance";

export const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th"; // covers 11th to 20th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const getCurrentDate = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// utils/fetchCountries.ts

export const fetchCountries = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

// utils/helpers.ts
export const getPageNumbersToShow = (
  totalPages: number,
  currentPage: number,
  maxPagesToShow = 4
): number[] => {
  let start = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 0);
  let end = start + maxPagesToShow;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - maxPagesToShow, 0);
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
};

export const getQueryObject = (searchQuery: string, limit: number) => {
  const queryObj: Record<string, any> = {};

  if (searchQuery) {
    const isRegNo = /[-/]/.test(searchQuery);
    if (isRegNo) {
      queryObj.regNo = searchQuery;
    } else {
      queryObj.name = new RegExp(searchQuery, "i").source;
    }
  }

  queryObj.limit = limit;
  return queryObj;
};
