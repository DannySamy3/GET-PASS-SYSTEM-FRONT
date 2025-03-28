"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Save } from "lucide-react";
import {
  createClass,
  deleteClass,
  editClass,
  fetchClasses,
  getClassById,
} from "@/utils/courseController";

interface CourseData {
  _id?: string;
  name: string;
  classInitial: string;
  duration: string;
  tuitionFee: string;
}

interface ApiResponse {
  data: {
    classes: CourseData[];
  };
}

interface ClassResponse {
  data: {
    data: CourseData;
  };
}

const Course = () => {
  const [classes, setClasses] = useState<CourseData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [courseData, setCourseData] = useState<CourseData>({
    name: "",
    classInitial: "",
    duration: "",
    tuitionFee: "",
  });
  const [activeTab, setActiveTab] = useState("courses");
  const dispatch = useDispatch();

  useEffect(() => {
    getClasses();
  }, []);

  const getClasses = async () => {
    try {
      const response = (await fetchClasses()) as ApiResponse;
      if (response?.data?.classes) {
        setClasses(response.data.classes);
      }
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to fetch classes",
          type: "error",
        })
      );
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateCourse = async () => {
    try {
      if (isEditing && courseData._id) {
        await editClass(courseData._id, courseData);
        dispatch(
          showToast({
            message: "Course updated successfully!",
            type: "success",
          })
        );
      } else {
        await createClass(courseData);
        dispatch(
          showToast({
            message: "Course created successfully!",
            type: "success",
          })
        );
      }
      resetForm();
      getClasses();
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message: err.response?.data?.message || "Action failed",
          type: "error",
        })
      );
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const response = (await getClassById(id)) as ClassResponse;
      if (response?.data?.data) {
        const { name, classInitial, duration, _id, tuitionFee } =
          response.data.data;
        setCourseData({ name, classInitial, duration, _id, tuitionFee });
        setIsEditing(true);
        setActiveTab("courses");
      }
    } catch (error) {
      dispatch(
        showToast({ message: "Failed to fetch course details", type: "error" })
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClass(id);
      dispatch(
        showToast({ message: "Course deleted successfully", type: "success" })
      );
      getClasses();
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message: err.response?.data?.message || "Deletion failed",
          type: "error",
        })
      );
    }
  };

  const resetForm = () => {
    setCourseData({ name: "", classInitial: "", duration: "", tuitionFee: "" });
    setIsEditing(false);
  };

  return (
    <div className='min-h-screen'>
      <div className='p-6 space-y-6'>
        <div className='flex justify-between items-center bg-gradient-to-r from-blue-700 via-slate-800 to-slate-900 text-white p-6 rounded-lg shadow-lg'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Course Management
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-1 bg-gray-100'>
            <TabsTrigger
              value='courses'
              className='data-[state=active]:bg-white data-[state=active]:text-gray-800'
            >
              Courses
            </TabsTrigger>
          </TabsList>

          <TabsContent value='courses'>
            <Card className='border-gray-200 shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-gray-100 to-white text-gray-800 rounded-t-lg border-b'>
                <CardTitle>
                  {isEditing ? "Edit Course" : "Add New Course"}
                </CardTitle>
                <CardDescription className='text-gray-600'>
                  {isEditing
                    ? "Update the course information below"
                    : "Enter the details to add a new course"}
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <div className='grid gap-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='name' className='text-gray-700'>
                        Course Name
                      </Label>
                      <Input
                        id='name'
                        name='name'
                        value={courseData.name}
                        onChange={handleInputChange}
                        placeholder='Enter course name'
                        className='border-gray-300 focus:border-gray-400'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='classInitial' className='text-gray-700'>
                        Course Initial
                      </Label>
                      <Input
                        id='classInitial'
                        name='classInitial'
                        value={courseData.classInitial}
                        onChange={handleInputChange}
                        placeholder='Enter course initial'
                        className='border-gray-300 focus:border-gray-400'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='duration' className='text-gray-700'>
                        Duration
                      </Label>
                      <Input
                        id='duration'
                        name='duration'
                        value={courseData.duration}
                        onChange={handleInputChange}
                        placeholder='Enter course duration'
                        className='border-gray-300 focus:border-gray-400'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='tuitionFee' className='text-gray-700'>
                        Tuition Fee
                      </Label>
                      <div className='relative'>
                        <Input
                          id='tuitionFee'
                          name='tuitionFee'
                          type='number'
                          value={courseData.tuitionFee}
                          onChange={handleInputChange}
                          placeholder='Enter tuition fee'
                          className='border-gray-300 focus:border-gray-400 pl-8'
                          min='0'
                          step='1000'
                        />
                        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600'>
                          $
                        </span>
                      </div>
                      {/* <p className='text-xs text-gray-600'>
                        {new Intl.NumberFormat("en-US").format(
                          Number(courseData.tuitionFee || 0)
                        )}
                        /=
                      </p> */}
                    </div>
                  </div>
                  <div className='flex justify-end gap-2'>
                    {isEditing && (
                      <Button
                        variant='outline'
                        onClick={resetForm}
                        className='border-gray-300 text-gray-700 hover:bg-gray-100'
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      onClick={handleCreateOrUpdateCourse}
                      className='bg-gray-200 hover:bg-gray-300 text-gray-800'
                    >
                      {isEditing ? (
                        <>
                          <Save className='mr-2 h-4 w-4' />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <Plus className='mr-2 h-4 w-4' />
                          Add Course
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='mt-6 border-gray-200 shadow-sm'>
              <CardHeader className='bg-gradient-to-r from-gray-100 to-white text-gray-800 rounded-t-lg border-b'>
                <CardTitle>Courses List</CardTitle>
                <CardDescription className='text-gray-600'>
                  Manage your courses and their associated information
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-6'>
                <Table>
                  <TableHeader className='bg-blue-100/70'>
                    <TableRow>
                      <TableHead className='text-gray-700'>Name</TableHead>
                      <TableHead className='text-gray-700'>Initial</TableHead>
                      <TableHead className='text-gray-700'>Duration</TableHead>
                      <TableHead className='text-gray-700'>
                        Tuition Fee
                      </TableHead>
                      <TableHead className='text-gray-700 w-[100px]'>
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
                <div className='h-[180px] sm:h-[200px] md:h-[220px] lg:h-[200px] overflow-auto'>
                  <Table>
                    <TableBody>
                      {classes.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className='text-center py-6 text-gray-500'
                          >
                            No courses found. Add your first course above.
                          </TableCell>
                        </TableRow>
                      ) : (
                        classes.map((course, index) => (
                          <TableRow
                            key={course._id}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-blue-100/50"
                            }
                          >
                            <TableCell className='font-medium'>
                              <div className='flex items-center gap-2'>
                                <div className='w-3 h-3 rounded-full bg-gradient-to-r from-blue-300 to-blue-400'></div>
                                {course.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant='outline'
                                className='bg-blue-100/70 text-gray-700 border-blue-300'
                              >
                                {course.classInitial}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className='bg-blue-200/70 hover:bg-blue-300/70 text-gray-800'>
                                {course.duration}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className='bg-green-200/70 hover:bg-green-300/70 text-gray-800'>
                                {new Intl.NumberFormat("en-US").format(
                                  Number(course.tuitionFee || 0)
                                )}
                                /=
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className='flex space-x-2'>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  onClick={() => handleEdit(course._id!)}
                                  className='border-blue-300 text-gray-700 hover:bg-blue-100/70'
                                >
                                  <Pencil className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  onClick={() => handleDelete(course._id!)}
                                  className='border-red-300 text-red-600 hover:bg-red-50'
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                    <Table />
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Course;
