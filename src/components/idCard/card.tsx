import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { getStudentById } from "@/utils/studentController";
import { getClassById } from "@/utils/classController";

interface Prop {
  studentId: any;
  isOpen: boolean;
  onClose: () => void;
}

const Card: React.FC<Prop> = ({ studentId, isOpen, onClose }) => {
  const [student, setStudent] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null); // Ref to the card modal for printing

  // Data to encode into the QR code (can be student regNo or any other data)
  const qrData = {
    studentId,
  };

  const getDetails = async () => {
    try {
      const result = await getStudentById(studentId);
      if (result) {
        const classData = await getClassById(result?.data.classId);
        setStudent({
          ...result.data,
          className: classData.data.name,
        });
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };
  console.log(studentId);

  useEffect(() => {
    getDetails();
  }, []);

  if (!isOpen) return null; // Return null if modal is not open
  const handlePrint = () => {
    if (cardRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write("<html><head><title>Print</title>");

      //   printWindow?.document.write(`
      //   <style>
      //     @media print {
      //       body {
      //         font-family: Arial, sans-serif;
      //         margin:0;
      //         padding: 0;
      //         display:inline ;
      //         width:"0";

      //         justify-content: center;
      //         align-items: center;
      //         // height: 100vh;
      //         background: white;
      //       }

      //       .card {
      //         width: 24px; /* CR80 card width */
      //         height: 24px; /* CR80 card height */
      //         margin: 0 auto;
      //         padding: 5mm; /* Allow some safe zone around the edges */
      //         background-color: white;
      //         border: 1px solid #ddd;
      //         border-radius: 4px;
      //         box-sizing: border-box;
      //       }

      //       .card svg {
      //         width: 25mm; /* Adjust for QR code size */
      //         height: 25mm;
      //         display:inline;

      //       }

      //       .card .details {
      //         font-size: 4mm; /* Adjust font size for readability */
      //         text-align: center;
      //       }

      //       .card .header {
      //         text-align: center;
      //         font-size: 5mm; /* Emphasize the header */
      //         margin-bottom: 4mm;
      //       }

      //       .card .qr-code {
      //         margin-top: 15mm; /* Adjust spacing for alignment */
      //         display: flex;
      //         justify-content: center;
      //       }

      //       .card button {
      //         display: none; /* Hide buttons during printing */
      //       }
      //     }
      //   </style>
      // `);

      printWindow?.document.write("</head><body>");

      // Clone the card content
      const printContent = cardRef.current.cloneNode(true) as HTMLElement;

      // Inline the SVG content
      const svgElements = printContent.querySelectorAll("svg");
      svgElements.forEach((svg) => {
        const svgHTML = svg.outerHTML;
        svg.insertAdjacentHTML("beforebegin", svgHTML);
        svg.remove(); // Remove the original SVG to avoid duplication
      });

      const buttons = printContent.querySelectorAll("button");
      const svg = printContent.querySelector("svg");
      const details = printContent.querySelector("article");
      details?.style.setProperty("font", "20px");

      svg?.style.setProperty("height", "150px");
      svg?.style.setProperty("margin-top", "250px");
      svg?.style.setProperty("width", "150px");
      svg?.style.setProperty("display", "block");
      svg?.style.setProperty("margin", "auto");

      buttons.forEach((button) => button.remove()); // Remove buttons
      printWindow?.document.write(printContent.innerHTML);
      printWindow?.document.write("</body></html>");
      printWindow?.document.close();
      printWindow?.print(); // Trigger the print dialog
    }
  };

  return (
    <>
      <div
        className='fixed inset-0 bg-gray-800 bg-opacity-100g z-50 flex justify-center items-center'
        onClick={onClose}
      >
        <div
          className='bg-gray-100 p-6 space-y-4 max-w-sm w-full shadow-lg rounded-lg card'
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          ref={cardRef} // Assign the ref to the card modal
        >
          <div
            id=''
            className='text-center font-bold text-lg text-gray-800 header'
          >
            Student ID Card
          </div>

          {/* Avatar Section */}
          <div className='flex justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='black'
              className='w-20 h-20' // For screen size
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
              />
            </svg>
          </div>

          {student ? (
            <article className='space-y-2 mt-4 details'>
              <div className='text-sm text-gray-600'>
                <strong>Name:</strong> {student?.firstName} {student?.lastName}
              </div>
              <div className='text-sm text-gray-600'>
                <strong>Class:</strong> {student?.className}
              </div>
              <div className='text-sm text-gray-600'>
                <strong>Reg No:</strong> {student?.regNo}
              </div>
            </article>
          ) : (
            <div>Loading...</div>
          )}

          {/* QR Code Section */}
          <div className='flex justify-center mt-4 qr-code'>
            <QRCode value={JSON.stringify(qrData)} size={128} />
          </div>

          <div className='mt-4 text-center'>
            <button
              className='px-4 py-2 bg-red-500 text-white rounded-md'
              onClick={onClose}
            >
              Close
            </button>
            <button
              className='px-4 py-2 bg-blue-500 text-white rounded-md ml-2'
              onClick={handlePrint} // Trigger print on button click
            >
              Print
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
