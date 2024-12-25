"use client";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import Header from "../reUsables/Header";
import { getAllStudents } from "@/utils/studentController";
import { getClassById } from "@/utils/classController";
import { AddStudent } from "./AddStudent";
import { Details } from "../studentDetails/Details";
export const StudentList = () => {
  const [studentsData, setStudentData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [pageNumbers, setPageNumbers] = useState<any>([]);
  const [input, setInput] = useState("");
  const [limit, setLimit] = useState(10);
  const [toggleView, setToggleView] = useState(false);
  const [viewDetails, setViewDetails] = useState({ view: false, id: null });
  const [totalResults, setTotalResults] = useState(0);
  // const [selectedPage, setSetSelectedPage] = useState("");

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

  console.log(studentsData);
  useEffect(() => {
    fetchstudents();

    // getClass();
  }, []);

  return (
    <div className='w-full   max-w-full px-4 sm:px-6'>
      <Header
        title={toggleView ? "Registration" : "Management"}
        view={{ setToggleView, toggleView }}
      />

      {toggleView && !viewDetails.view && <AddStudent viewer={setToggleView} />}

      {viewDetails.view && (
        <Details id={viewDetails.id} setView={setViewDetails} />
      )}

      {!toggleView && !viewDetails.view && (
        <section className=' bg-white mt-12  font-montserrat border overflow-y-hidden     border-[#D6D4D4] rounded-[12px] w-full '>
          <article
            ref={containerRef}
            className=' pt-12 pb-6  px-14 flex flex-col gap-8 '
          >
            <section className='  flex justify-between items-center  '>
              <label className='input text-sm border border-[#D6D4D4] input-[5px] w-[85%] input-bordered flex items-center gap-2'>
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
              <div className=' flex justify-around w-[20%] items-center'>
                <label className=' text-[#585858] font-[500] text-sm w-auto'>
                  {`
                  ${Math.min(
                    totalResults,
                    (currentPage - 1) * limit + studentsData.students?.length
                  )} out of ${totalResults} 
                `}
                </label>
                <select
                  onChange={(e: any) => {
                    setLimit(Number(e.target.value));
                    setCurrentPage(1);
                    if (input) {
                      console.log(e.target.value);
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
            <div className=' h-[540px] overflow-y-auto    '>
              <section className=' h-auto  items-center     grid grid-cols-[0.3fr_0.3fr_0.3fr_0.3fr_0.3fr_0.1fr] gap-y-5 px-1 '>
                <label className=' text-[#475053] font-[500] text-base '>
                  Name
                </label>
                <label className=' text-[#475053] font-[500] text-base'>
                  Mid Name
                </label>
                <label className=' text-[#475053] font-[500] text-base'>
                  SurName
                </label>
                <label className=' text-[#475053] font-[500] text-base'>
                  Course
                </label>
                <label className=' text-[#475053] font-[500] text-base'>
                  Reg No
                </label>
                <label className=' text-[#475053] font-[500] text-base'>
                  Actions
                </label>
                <div className=' h-[2px] bg-[#D6D4D4] col-span-6  '></div>
                {studentsData.students?.map((student: any, i: any) => (
                  <button
                    onClick={() =>
                      setViewDetails((prev) => ({
                        ...prev,
                        view: true,
                        id: student._id,
                      }))
                    }
                    className='group col-span-6 hover:text-white text-[#414141] grid grid-cols-[0.3fr_0.3fr_0.3fr_0.3fr_0.3fr_0.1fr] px-2 py-[10px] rounded-md hover:bg-[#1CA2BB]   '
                    key={i}
                  >
                    <div className=' flex gap-8 text-start  font-[500] text-[15px]'>
                      <span className=' text-start text-[15px]'>
                        <span>{(currentPage - 1) * limit + i + 1}</span>
                      </span>

                      {student.firstName}
                    </div>

                    <div className=' font-[500] text-[15px] text-start '>
                      {student.secondName}
                    </div>
                    <div className=' font-[500] text-start text-[15px] '>
                      {student.lastName}
                    </div>
                    <div className=' font-[500] text-[15px] text-start '>
                      {student.className}
                    </div>
                    <div className=' font-[500] text-start text-[15px] text-[#595959]  group-hover:text-white '>
                      {student.regNo}
                    </div>
                    <div className=' flex justify-between'>
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 35 36'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='group-hover:bg-white rounded'
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the button's onClick from firing
                          console.log("Icon 1 clicked");
                          // Add your icon-specific functionality here
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
                          d='M23.5556 23.5556H25.7778C26.3671 23.5556 26.9324 23.3214 27.3491 22.9047C27.7659 22.4879 28 21.9227 28 21.3333V16.8889C28 16.2995 27.7659 15.7343 27.3491 15.3175C26.9324 14.9008 26.3671 14.6667 25.7778 14.6667H10.2222C9.63285 14.6667 9.06762 14.9008 8.65087 15.3175C8.23413 15.7343 8 16.2995 8 16.8889V21.3333C8 21.9227 8.23413 22.4879 8.65087 22.9047C9.06762 23.3214 9.63285 23.5556 10.2222 23.5556H12.4444M14.6667 28H21.3333C21.9227 28 22.4879 27.7659 22.9047 27.3491C23.3214 26.9324 23.5556 26.3671 23.5556 25.7778V21.3333C23.5556 20.744 23.3214 20.1787 22.9047 19.762C22.4879 19.3452 21.9227 19.1111 21.3333 19.1111H14.6667C14.0773 19.1111 13.5121 19.3452 13.0953 19.762C12.6786 20.1787 12.4444 20.744 12.4444 21.3333V25.7778C12.4444 26.3671 12.6786 26.9324 13.0953 27.3491C13.5121 27.7659 14.0773 28 14.6667 28ZM23.5556 14.6667V10.2222C23.5556 9.63285 23.3214 9.06762 22.9047 8.65087C22.4879 8.23413 21.9227 8 21.3333 8H14.6667C14.0773 8 13.5121 8.23413 13.0953 8.65087C12.6786 9.06762 12.4444 9.63285 12.4444 10.2222V14.6667H23.5556Z'
                          stroke='black'
                          //   stroke-linecap='round'
                          //   stroke-linejoin='round'
                        />
                      </svg>

                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 35 36'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='group-hover:bg-white rounded'
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the button's onClick from firing
                          console.log("Icon 2 clicked");
                          // Add your icon-specific functionality here
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
                          //   fill-rule='evenodd'
                          //   clip-rule='evenodd'
                          d='M9.93518 13.4743C11.6477 17.0793 14.7406 19.3335 18.2064 19.3349C18.2075 19.3349 18.2086 19.3349 18.2097 19.3349V18.0849C18.2091 18.0849 18.2086 18.0849 18.2081 18.0849C18.2075 18.0849 18.207 18.0849 18.2064 18.0849M18.2081 18.0849C21.087 18.0842 23.7969 16.2113 25.3518 12.9379L25.6201 12.3734L26.7491 12.9097L26.4809 13.4743C24.7684 17.0793 21.6756 19.3335 18.2097 19.3349M18.2081 18.0849C15.3292 18.0842 12.6192 16.2113 11.0643 12.9379L10.7961 12.3734L9.66699 12.9097L9.93518 13.4743'
                          fill='black'
                        />
                        <path
                          //   fill-rule='evenodd'
                          //   clip-rule='evenodd'
                          d='M23.6993 15.5461L26.3424 18.1893L25.4585 19.0731L22.8154 16.4299L23.6993 15.5461Z'
                          fill='black'
                        />
                        <path
                          //   fill-rule='evenodd'
                          //   clip-rule='evenodd'
                          d='M12.651 15.5461L10.0078 18.1893L10.8917 19.0731L13.5348 16.4299L12.651 15.5461Z'
                          fill='black'
                        />
                        <path
                          //   fill-rule='evenodd'
                          //   clip-rule='evenodd'
                          d='M20.5775 17.6621L21.6296 21.2872L20.4292 21.6357L19.377 18.0106L20.5775 17.6621Z'
                          fill='black'
                        />
                        <path
                          //   fill-rule='evenodd'
                          //   clip-rule='evenodd'
                          d='M15.7719 17.6624L14.7197 21.2874L15.9202 21.6359L16.9724 18.0108L15.7719 17.6624Z'
                          fill='black'
                        />
                      </svg>
                    </div>
                  </button>
                ))}
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
    </div>
  );
};
