"use client";

import { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { getStudentsStats } from "@/utils/studentController";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

Chart.register(...registerables);

export const DashboardGraph = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [classes, setClasses] = useState<{
    initials: string[];
    registered: number[];
    unregistered: number[];
  }>({
    initials: [],
    registered: [],
    unregistered: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  const getStats = async () => {
    try {
      setIsLoading(true);
      const response = await getStudentsStats();

      if (response && response.data) {
        const data = response.data as {
          classInitials: string[];
          registered: Record<string, number>;
          unregistered: Record<string, number>;
        };

        const initials = data.classInitials || [];

        const registeredPercentages = initials.map((initial) => {
          const reg = data.registered[initial] || 0;
          const unreg = data.unregistered[initial] || 0;
          const total = reg + unreg;
          return total === 0 ? 0 : (reg / total) * 100;
        });

        const unregisteredPercentages = initials.map((initial) => {
          const reg = data.registered[initial] || 0;
          const unreg = data.unregistered[initial] || 0;
          const total = reg + unreg;
          return total === 0 ? 0 : (unreg / total) * 100;
        });

        setClasses({
          initials,
          registered: registeredPercentages,
          unregistered: unregisteredPercentages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch student stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!chartRef.current || isLoading) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [...classes.initials],
        datasets: [
          {
            label: "Unregistered",
            data: classes.unregistered,
            backgroundColor: "hsl(215, 16%, 47%)",
            borderColor: "hsl(215, 16%, 47%)",
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
          },
          {
            label: "Registered",
            data: classes.registered,
            backgroundColor: "hsl(214, 84%, 56%)",
            borderColor: "hsl(214, 84%, 56%)",
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.9,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 30,
            top: 20,
            bottom: 40,
          },
        },
        plugins: {
          title: {
            display: false,
          },
          legend: {
            position: "top",
            align: "center",
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              font: {
                size: 12,
              },
              padding: 15,
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
              label: (context) =>
                `${context.dataset.label}: ${(context.raw as number).toFixed(
                  1
                )}%`,
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
                weight: "normal",
              },
              padding: {
                top: 15,
              },
              color: "#64748b",
            },
            ticks: {
              font: {
                size: 11,
              },
              color: "#64748b",
              maxRotation: 0,
              autoSkip: false,
              padding: 8,
            },
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: 100, // Force y-axis max to 100%
            title: {
              display: true,
              text: "Student %",
              font: {
                size: 12,
                weight: "normal",
              },
              padding: {
                bottom: 10,
              },
              color: "#64748b",
            },
            ticks: {
              font: {
                size: 11,
              },
              color: "#64748b",
              callback: (value) => value + "%",
              maxTicksLimit: 6,
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [classes, isLoading]);

  useEffect(() => {
    getStats();
  }, []);

  return (
    <Card className='w-full h-full border rounded-lg shadow-sm bg-white overflow-hidden'>
      <CardHeader className='pb-0'>
        <CardTitle className='text-lg font-semibold text-center text-[#1e3a8a]'>
          PAYMENT STATISTICS
        </CardTitle>
      </CardHeader>
      <CardContent className='px-4 pb-12'>
        <div className='w-full h-[350px] relative'>
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <div className='w-8 h-8 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin'></div>
            </div>
          ) : (
            <canvas ref={chartRef} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardGraph;
