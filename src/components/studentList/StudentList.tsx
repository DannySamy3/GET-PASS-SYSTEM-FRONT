"use client";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import Header from "../reUsables/Header";
import { getAllStudents } from "@/utils/studentController";
import { getClassById } from "@/utils/classController";
import { AddStudent } from "./AddStudent";
import { Details } from "../studentDetails/Details";
import Card from "../idCard/card";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import ToastNotification from "@/components/toastNotification/ToastNotification";
export const StudentList = () => {
  const [studentsData, setStudentData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [pageNumbers, setPageNumbers] = useState<any>([]);
  const [input, setInput] = useState("");
  const [limit, setLimit] = useState(10);
  const [changeView, setChangeView] = useState(false);
  const [viewDetails, setViewDetails] = useState({
    view: false,
    id: null,
    cardId: "",
  });
  const [totalResults, setTotalResults] = useState(0);
  const [viewCard, setViewCard] = useState(false);
  // const [selectedPage, setSetSelectedPage] = useState("");

  const dispatch = useDispatch();

  const searchPlan = (searchQuery: string, limit: number) => {
    const queryObj: any = {};

    // Check if the search query contains characters like '-' or '/'
    const isRegNo = /[-/]/.test(searchQuery);

    if (searchQuery) {
      if (isRegNo) {
        // If the search query is a registration number
        queryObj.regNo = searchQuery;
        queryObj.limit = limit;
      } else {
        // If the search query is a name
        const nameRegex = new RegExp(searchQuery, "i"); // 'i' makes the regex case-insensitive
        queryObj.name = nameRegex.source; // Use the regex source for the query string
        queryObj.limit = limit;
      }
    }

    fetchstudents(queryObj);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    const container = containerRef.current;

    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handlePagination = async (id: Number) => {
    // setSetSelectedPage(id.toString());

    // console.log("this is current page ", id);
    if (input) {
      fetchstudents({ page: id, name: input, limit });
      setCurrentPage(id);
      scrollToTop();
    } else {
      fetchstudents({ page: id, name: input, limit });
      setCurrentPage(id);
      scrollToTop();
    }

    // else {
    //   scrollToTop();
    //   fetchstudents({ page: id });
    //   setCurrentPage(id);
    // }
  };

  const getPageNumbersToShow = (pageNumbers: number[], currentPage: number) => {
    const totalPages = studentsData.totalPages;
    const maxPagesToShow = 4;
    let start = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 0);
    let end = start + maxPagesToShow;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxPagesToShow, 0);
    }

    return pageNumbers.slice(start, end);
  };
  const fetchstudents = async (query = {}) => {
    let pageArray;

    try {
      if (query && Object.keys(query).length > 0) {
        const result = await getAllStudents(query);
        if (result) {
          const { data } = result;
          // console.log("this is query", query);
          // console.log("result data", data);

          setTotalResults(data.data.total);
          pageArray = Array.from(
            { length: data.data.totalPages },
            (_, i) => i + 1
          );
          // console.log("search data", pageArray);

          // setStudentData(data.data);
          const studentsWithClass = await Promise.all(
            data.data.students.map(async (student: any) => {
              const classData = await getClassById(student.classId);

              const course = classData.data.name ?? (
                <span className=' text-red-600 text-sm '>
                  Failed getting class
                </span>
              );
              return { ...student, className: course };
            })
          );
          setStudentData({ students: studentsWithClass });
          setPageNumbers(pageArray);
        }

        return;
      } else {
        const result = await getAllStudents();
        if (result) {
          const { data } = result;
          setTotalResults(data.data.total);

          // console.log("without query", data);

          pageArray = Array.from(
            { length: data.data.totalPages },
            (_, i) => i + 1
          );
          // setStudentData(data.data);

          // setStudentData(data.data);
          const studentsWithClass = await Promise.all(
            data.data.students.map(async (student: any) => {
              const classData = await getClassById(student.classId);
              const course = classData.data.name ?? (
                <span className=' text-red-600 text-sm '>
                  Failed getting class
                </span>
              );
              // console.log("this is classData", course);
              return { ...student, className: course };
            })
          );
          setStudentData({ students: studentsWithClass });
          setPageNumbers(pageArray);
        }
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message ||
            " Network issue, please check your connection.",
          type: "error",
        })
      );
    }
  };

  const pageNumbersToShow = getPageNumbersToShow(pageNumbers, currentPage);

  // console.log("all pages", pageNumbers);

  // const getClass = async (id: string) => {
  //   try {
  //     const response = await getClassById(id);

  //     return response.data.name;
  //   } catch (error) {
  //     return (
  //       <span className=' text-red-600 text-sm '>Failed getting class</
  // span>
  //     );
  //   }
  // };

  useEffect(() => {
    fetchstudents();

    // getClass();
  }, []);

  return (
    <div className='w-full h-full   max-w-full px-4 sm:px-6'>
      <Header
        title={changeView && !viewDetails.view ? "Registration" : "Management"}
        view={{ setChangeView, changeView }}
      />

      {changeView && !viewDetails.view && <AddStudent />}

      {viewDetails.view && (
        <Details
          id={viewDetails.id}
          setView={setViewDetails}
          setDate={setChangeView}
        />
      )}

      {!changeView && !viewDetails.view && (
        <section className=' bg-white mt-12 h-auto max-h-[750px] overflow-y-scroll font-montserrat border overflow-y-hidden     border-[#D6D4D4] rounded-[12px] w-full '>
          <article
            ref={containerRef}
            className=' pt-12 pb-6  px-14 flex flex-col gap-8 '
          >
            <section className='  flex justify-between items-center   '>
              <label className='input text-sm border border-[#D6D4D4] input-[5px] min-w-[78%] input-bordered flex items-center gap-2'>
                <input
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setCurrentPage(1);
                      searchPlan(input, limit);

                      scrollToTop();
                    }
                  }}
                  type='text'
                  className='grow '
                  placeholder='Search by Name, Reg No , Course...'
                />
                <svg
                  onClick={() => searchPlan(input, limit)}
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 16 16'
                  fill='currentColor'
                  className='h-4 w-4 opacity-70'
                >
                  <path
                    fillRule='evenodd'
                    d='M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z'
                    clipRule='evenodd'
                  />
                </svg>
              </label>
              <div className=' flex justify-around w-[24%] items-center'>
                <label className='text-[#585858] font-[500] text-sm w-auto'>
                  {`
    ${
      totalResults > 0
        ? Math.min(
            totalResults,
            (currentPage - 1) * limit + studentsData.students?.length
          )
        : 0
    } out of ${totalResults}
  `}
                </label>

                <select
                  onChange={(e: any) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                    if (input) {
                      fetchstudents({
                        limit: Number(e.target.value),
                        name: input,
                        page: 1,
                      });
                    } else {
                      fetchstudents({
                        limit: Number(e.target.value),
                        page: currentPage,
                      });
                    }
                  }}
                  className='select  border-[1px] text-[#585858] font-[500] text-sm border-[#D6D4D4]  select-bordered w-auto   max-w-xs'
                >
                  <option value={10}>Default</option>
                  <option value={15}>15</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </section>
            <div className='     '>
              <section className='h-auto  px-2  '>
                {/* Fixed Header */}
                <div className='grid grid-cols-[0.1fr_0.2fr_0.2fr_0.2fr_0.3fr_0.2fr_0.1fr] gap-y-3'>
                  <label className='text-[#475053] text-start font-[500] text-base'>
                    S/N
                  </label>
                  <label className='text-[#475053] text-start font-[500] text-base'>
                    Name
                  </label>
                  <label className='text-[#475053] text-start font-[500] text-base'>
                    Mid Name
                  </label>
                  <label className='text-[#475053] text-start font-[500] text-base'>
                    SurName
                  </label>
                  <label className='text-[#475053] text-start font-[500] text-base'>
                    Course
                  </label>
                  <label className='text-[#475053] text-start font-[500] text-base'>
                    Reg No
                  </label>
                  <label className='text-[#475053] text-start font-[500] text-base'>
                    Actions
                  </label>
                  <div className='h-[2px] bg-[#D6D4D4] text-start   col-span-7'></div>
                </div>

                {/* Divider line */}

                {/* Scrollable Content */}
                <div className='overflow-y-auto  grid grid-cols-[0.1fr_0.2fr_0.2fr_0.2fr_0.3fr_0.2fr_0.1fr] gap-y-4 mt-3'>
                  {studentsData.students?.map((student: any, i: any) => (
                    <div
                      onClick={() => {
                        setViewDetails((prev) => ({
                          ...prev,
                          view: true,
                          id: student._id,
                        }));
                        setChangeView(true);
                      }}
                      className='cursor-pointer group col-span-7 hover:text-white text-[#414141] grid grid-cols-[0.1fr_0.2fr_0.2fr_0.2fr_0.3fr_0.2fr_0.1fr] px-2 py-[10px] rounded-md hover:bg-[#1CA2BB]'
                      key={i}
                    >
                      {/* Conditionally rendering the Card component when the 'viewCard' state is true */}
                      {viewCard && viewDetails.cardId === student._id && (
                        <Card
                          studentId={viewDetails.cardId} // Passing the student's ID from viewDetails state
                          isOpen={viewCard}
                          onClose={() => setViewCard(false)}
                        />
                      )}

                      <div className=' text-[15px]'>
                        <span>{(currentPage - 1) * limit + i + 1}</span>
                      </div>
                      <div className=' font-[500] text-[15px]'>
                        {student.firstName}
                      </div>
                      <div className='font-[500] text-[15px] '>
                        {student.secondName}
                      </div>
                      <div className='font-[500]  text-[15px]'>
                        {student.lastName}
                      </div>
                      <div className='font-[500] text-[15px] '>
                        {student.className}
                      </div>
                      <div className='font-[500]  text-[15px] text-[#595959] group-hover:text-white'>
                        {student.regNo}
                      </div>

                      <div className='flex ml-5'>
                        <svg
                          width='24'
                          height='24'
                          viewBox='0 0 35 36'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          className='group-hover:bg-white rounded'
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents the card's onClick from firing
                            console.log("Icon 2 clicked");

                            // Set the clicked student ID and show the card modal
                            setViewDetails((prev) => ({
                              ...prev,
                              cardId: student._id, // Directly using the student's _id here
                            }));
                            setViewCard(true); // Open the card modal
                          }}
                        >
                          <rect
                            x='0.5'
                            y='0.5'
                            width='34'
                            height='35'
                            rx='5.5'
                            stroke='#585858'
                          />
                          <path
                            d='M9.93518 13.4743C11.6477 17.0793 14.7406 19.3335 18.2064 19.3349C18.2075 19.3349 18.2086 19.3349 18.2097 19.3349V18.0849C18.2091 18.0849 18.2086 18.0849 18.2081 18.0849C18.2075 18.0849 18.207 18.0849 18.2064 18.0849M18.2081 18.0849C21.087 18.0842 23.7969 16.2113 25.3518 12.9379L25.6201 12.3734L26.7491 12.9097L26.4809 13.4743C24.7684 17.0793 21.6756 19.3335 18.2097 19.3349M18.2081 18.0849C15.3292 18.0842 12.6192 16.2113 11.0643 12.9379L10.7961 12.3734L9.66699 12.9097L9.93518 13.4743'
                            fill='black'
                          />
                          <path
                            d='M23.6993 15.5461L26.3424 18.1893L25.4585 19.0731L22.8154 16.4299L23.6993 15.5461Z'
                            fill='black'
                          />
                          <path
                            d='M12.651 15.5461L10.0078 18.1893L10.8917 19.0731L13.5348 16.4299L12.651 15.5461Z'
                            fill='black'
                          />
                          <path
                            d='M20.5775 17.6621L21.6296 21.2872L20.4292 21.6357L19.377 18.0106L20.5775 17.6621Z'
                            fill='black'
                          />
                          <path
                            d='M15.7719 17.6624L14.7197 21.2874L15.9202 21.6359L16.9724 18.0108L15.7719 17.6624Z'
                            fill='black'
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div className='flex justify-center   '>
              <div className='flex items-center border bg-[#F3F4F6] rounded-lg'>
                <button
                  className={`h-full py-3 ${
                    currentPage <= 1 ||
                    currentPage <= 2 ||
                    pageNumbersToShow.length <= 1
                      ? "hidden"
                      : ""
                  } px-4 text-[#1F2937] text-sm font-normal hover:bg-[#D1D5DB]`}
                  onClick={() => handlePagination(currentPage - 1)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='black'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M15.75 19.5L8.25 12l7.5-7.5'
                    />
                  </svg>
                </button>
                {pageNumbersToShow?.map((pageNumber: any) => (
                  <button
                    key={pageNumber}
                    className={`py-3 px-4 text-[#1F2937] ${
                      pageNumber === currentPage
                        ? " bg-[#36C186] text-white"
                        : ""
                    }  text-sm font-normal hover:bg-[#D1D5DB]`}
                    onClick={() => handlePagination(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  className={` h-full ${
                    currentPage >= pageNumbers.length - 2 ? "hidden" : ""
                  } px-4 text-[#1F2937] text-sm font-normal hover:bg-[#D1D5DB]`}
                  onClick={() => handlePagination(currentPage + 1)}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='black'
                    className='w-4 h-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 4.5l7.5 7.5-7.5 7.5'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </section>
      )}
      <ToastNotification />
    </div>
  );
};
