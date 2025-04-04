"use client";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import { getAllStudents } from "@/utils/studentController";
import { getClassById } from "@/utils/classController";
import { AddStudent } from "./AddStudent";
import { Details } from "../studentDetails/Details";
import StudentCard from "../idCard/card";
// import { getCourseById } from "@/utils/courseController";
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, Plus, Eye } from "lucide-react";

interface StudentData {
  _id: string;
  firstName: string;
  secondName: string;
  lastName: string;
  regNo: string;
  classId: string;
  className: string;
}

interface ApiResponse {
  data: {
    data: {
      students: StudentData[];
      total: number;
      totalPages: number;
    };
  };
}

interface ClassResponse {
  data: {
    name: string;
    classInitial: string;
  };
}

interface StudentListState {
  students: StudentData[];
  total: number;
  totalPages: number;
}

export const StudentList = () => {
  const [studentsData, setStudentData] = useState<StudentListState>({
    students: [],
    total: 0,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [input, setInput] = useState("");
  const [limit, setLimit] = useState(10);
  const [changeView, setChangeView] = useState(false);
  const [viewDetails, setViewDetails] = useState({
    view: false,
    id: null as string | null,
    cardId: "",
  });
  const [totalResults, setTotalResults] = useState(0);
  const [viewCard, setViewCard] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const searchPlan = (searchQuery: string, limit: number) => {
    const queryObj: any = {};
    const isRegNo = /[-/]/.test(searchQuery);

    if (searchQuery) {
      if (isRegNo) {
        queryObj.regNo = searchQuery;
        queryObj.limit = limit;
      } else {
        const nameRegex = new RegExp(searchQuery, "i");
        queryObj.name = nameRegex.source;
        queryObj.limit = limit;
      }
    }

    fetchstudents(queryObj);
  };

  const scrollToTop = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handlePagination = async (id: number) => {
    if (input) {
      fetchstudents({ page: id, name: input, limit });
    } else {
      fetchstudents({ page: id, limit });
    }
    setCurrentPage(id);
    scrollToTop();
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

  const calculateSerialNumber = (index: number) => {
    if (!studentsData.students || studentsData.students.length === 0) {
      return "-";
    }
    return (currentPage - 1) * limit + index + 1;
  };

  const fetchstudents = async (query = {}) => {
    let pageArray;
    setIsLoading(true);

    try {
      const result = (await getAllStudents(query)) as ApiResponse;
      if (result?.data?.data) {
        const { students, total, totalPages } = result.data.data;
        setTotalResults(total);
        pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);

        const studentsWithClass = await Promise.all(
          students.map(async (student) => {
            const classData = (await getClassById(
              student.classId
            )) as ClassResponse;

            const course = classData?.data?.classInitial ?? (
              <span className='text-red-600 text-sm'>Failed getting class</span>
            );
            return { ...student, className: course };
          })
        );

        setStudentData({ students: studentsWithClass, total, totalPages });
        setPageNumbers(pageArray);
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message ||
            "Network issue, please check your connection.",
          type: "error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pageNumbersToShow = getPageNumbersToShow(pageNumbers, currentPage);

  useEffect(() => {
    fetchstudents();
  }, []);

  console.log(studentsData);

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='p-6 space-y-6 h-screen overflow-hidden'>
        <div className='flex justify-between items-center bg-gradient-to-r from-blue-700 via-slate-800 to-slate-900 text-white p-6 rounded-lg shadow-lg'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Student Management
          </h1>
          {!changeView && (
            <Button
              onClick={() => setChangeView(true)}
              className='bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Student
            </Button>
          )}
        </div>

        {changeView && !viewDetails.view && <AddStudent />}

        {viewDetails.view && (
          <Details
            id={viewDetails.id}
            setView={setViewDetails}
            setDate={setChangeView}
          />
        )}

        {!changeView && !viewDetails.view && (
          <UICard className='border-slate-200 shadow-md h-[calc(100vh-200px)] flex flex-col'>
            <CardHeader className='bg-gradient-to-r from-indigo-50 via-blue-50 to-white text-indigo-900 rounded-t-lg border-b border-slate-200'>
              <CardTitle>Students List</CardTitle>
              <CardDescription className='text-indigo-700'>
                Manage and view all student information
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-1 overflow-hidden flex flex-col'>
              <div className='flex flex-col gap-6 h-full'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='relative flex-1 max-w-md'>
                      <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500' />
                      <Input
                        placeholder='Search by Name, Reg No, Course...'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setCurrentPage(1);
                            searchPlan(input, limit);
                            scrollToTop();
                          }
                        }}
                        className='pl-10 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500'
                      />
                    </div>
                    <Button
                      onClick={() => {
                        setCurrentPage(1);
                        searchPlan(input, limit);
                        scrollToTop();
                      }}
                      variant='outline'
                      className='border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
                    >
                      Search
                    </Button>
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-sm text-indigo-700 font-medium'>
                      {`${Math.min(
                        totalResults,
                        (currentPage - 1) * limit +
                          studentsData.students?.length
                      )} out of ${totalResults}`}
                    </span>
                    <Select
                      value={limit.toString()}
                      onValueChange={(value) => {
                        setLimit(Number(value));
                        setCurrentPage(1);
                        if (input) {
                          fetchstudents({
                            limit: Number(value),
                            name: input,
                            page: 1,
                          });
                        } else {
                          fetchstudents({
                            limit: Number(value),
                            page: 1,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className='w-[100px] border-indigo-200 focus:ring-indigo-500'>
                        <SelectValue placeholder='Limit' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='10'>10</SelectItem>
                        <SelectItem value='15'>15</SelectItem>
                        <SelectItem value='30'>30</SelectItem>
                        <SelectItem value='50'>50</SelectItem>
                        <SelectItem value='100'>100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='rounded-md border border-slate-200 shadow-sm flex-1 overflow-hidden'>
                  <div className='h-full overflow-auto'>
                    <Table>
                      <TableHeader className='bg-indigo-50/80 sticky top-0 z-10 backdrop-blur-sm'>
                        <TableRow>
                          <TableHead className='text-indigo-900 font-semibold'>
                            S/N
                          </TableHead>
                          <TableHead className='text-indigo-900 font-semibold'>
                            Name
                          </TableHead>
                          <TableHead className='text-indigo-900 font-semibold'>
                            Mid Name
                          </TableHead>
                          <TableHead className='text-indigo-900 font-semibold'>
                            SurName
                          </TableHead>
                          <TableHead className='text-indigo-900 font-semibold'>
                            Course
                          </TableHead>
                          <TableHead className='text-indigo-900 font-semibold'>
                            Reg No
                          </TableHead>
                          <TableHead className='w-[100px] text-indigo-900 font-semibold'>
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className='text-center py-6 text-indigo-700'
                            >
                              Loading...
                            </TableCell>
                          </TableRow>
                        ) : studentsData.students?.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className='text-center py-6 text-indigo-700'
                            >
                              No students found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          studentsData.students?.map((student, index) => (
                            <TableRow
                              key={student._id}
                              className='hover:bg-indigo-50/50 cursor-pointer transition-colors'
                              onClick={() => {
                                setViewDetails({
                                  view: true,
                                  id: student._id,
                                  cardId: "",
                                });
                                setChangeView(true);
                              }}
                            >
                              <TableCell className='text-indigo-900'>
                                {calculateSerialNumber(index)}
                              </TableCell>
                              <TableCell className='font-medium text-indigo-900'>
                                {student.firstName}
                              </TableCell>
                              <TableCell className='text-indigo-900'>
                                {student.secondName}
                              </TableCell>
                              <TableCell className='text-indigo-900'>
                                {student.lastName}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant='outline'
                                  className='bg-indigo-50 text-indigo-700 border-indigo-200 font-medium'
                                >
                                  {student.className}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className='bg-indigo-100 text-indigo-800 font-semibold shadow-sm hover:bg-indigo-200 transition-colors'>
                                  {student.regNo}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className='flex space-x-2'>
                                  <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewDetails((prev) => ({
                                        ...prev,
                                        cardId: student._id,
                                      }));
                                      setViewCard(true);
                                    }}
                                    className='border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className='flex items-center justify-center gap-2 mt-4'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handlePagination(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className='border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  {pageNumbersToShow?.map((pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={
                        pageNumber === currentPage ? "default" : "outline"
                      }
                      onClick={() => handlePagination(pageNumber)}
                      className={
                        pageNumber === currentPage
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
                      }
                    >
                      {pageNumber}
                    </Button>
                  ))}
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => handlePagination(currentPage + 1)}
                    disabled={currentPage >= pageNumbers.length}
                    className='border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300'
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </CardContent>
          </UICard>
        )}
      </div>

      {viewCard && (
        <StudentCard
          studentId={viewDetails.cardId}
          isOpen={viewCard}
          onClose={() => setViewCard(false)}
        />
      )}
    </div>
  );
};

export default StudentList;
