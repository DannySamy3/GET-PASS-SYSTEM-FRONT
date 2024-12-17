import React, { useState } from "react";
import { useEffect } from "react";
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
    } catch (error) {}
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
    plugins: {
      title: {
        display: true,
        text: "PAYMENT STATISTICS",
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
        },
        stacked: false,
      },
      y: {
        title: {
          display: true,
          text: "Student %",
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
    <div className='w-full md:w-[55%] bg-white h-[100px] md:h-[380px] shadow-lg rounded-lg px-4 ml-6'>
      <Bar data={data} options={options} />
    </div>
  );
};
