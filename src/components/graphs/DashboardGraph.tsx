import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { getStudentsStats } from "@/utils/studentController";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const DashboardGraph = () => {
  const [classes, setClasses] = useState({
    initials: "",
    registered: [],
    unregistered: [],
  });

  const getStats = async () => {
    try {
      const response = await getStudentsStats();

      if (response && response.data) {
        const { data } = response;
        console.log(data);

        setClasses((prev) => ({
          ...prev,
          initials: data.classInitials,
          registered: data.registered,
          unregistered: data.unregistered,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch student stats", error);
    }
  };

  // Sample data for the graph
  const data = {
    labels: [...classes.initials],
    datasets: [
      {
        label: "Un Registered",
        data: Object.values(classes.unregistered), // student numbers for group 1
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Bar color for Group 1
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Registered",
        data: Object.values(classes.registered), // student numbers for group 3
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color for Group 3
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Graph options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Important for responsiveness
    plugins: {
      title: {
        display: true,
        text: "PAYMENT STATISTICS",
        font: {
          size: 14, // Smaller font size for mobile
        },
      },
      legend: {
        labels: {
          font: {
            size: 10, // Smaller legend font for mobile
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} students`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Course",
          font: {
            size: 10, // Smaller axis title for mobile
          },
        },
        ticks: {
          font: {
            size: 8, // Smaller tick labels for mobile
          },
        },
        stacked: false,
      },
      y: {
        title: {
          display: true,
          text: "Student %",
          font: {
            size: 10, // Smaller axis title for mobile
          },
        },
        ticks: {
          font: {
            size: 8, // Smaller tick labels for mobile
          },
        },
        stacked: false,
      },
    },
  };

  useEffect(() => {
    getStats();
    const interval = setInterval(() => {
      getStudentsStats();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='w-full lg:block    md:mb-0 md:w-[55%] px-2 lg:max-w-full  lg:w-[69%]  lg:mb-3  bg-white h-auto md:h-[380px]  shadow-lg rounded-lg '>
      <div className='w-full  h-full'>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardGraph;
