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
  const [classes, setClasses] = useState<any>({
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

        setClasses((prev: any) => ({
          ...prev,
          // @ts-ignore
          initials: data.classInitials,
          // @ts-ignore
          registered: data.registered,
          // @ts-ignore
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
        data: Object.values(classes.unregistered),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Registered",
        data: Object.values(classes.registered),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Graph options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "PAYMENT STATISTICS",
        font: {
          size: 16,
          weight: "bold" as const,
        },
        padding: {
          bottom: 20,
        },
      },
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12,
            weight: "normal" as const,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1f2937",
        bodyColor: "#4b5563",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
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
            size: 12,
            weight: "normal" as const,
          },
          padding: {
            top: 10,
          },
        },
        ticks: {
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Student %",
          font: {
            size: 12,
            weight: "normal" as const,
          },
          padding: {
            bottom: 10,
          },
        },
        ticks: {
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
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
    <div className='w-full h-full'>
      <div className='w-full h-[400px]'>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default DashboardGraph;
