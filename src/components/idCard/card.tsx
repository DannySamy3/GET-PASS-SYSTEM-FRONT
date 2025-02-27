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
        // @ts-ignore
        const classData = await getClassById(result?.data.classId);
        setStudent({
          // @ts-ignore
          ...result.data,
          // @ts-ignore
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

          {/* Image Section */}
          <div className='flex justify-center'>
            {student?.image ? (
              <img
                src={student.image}
                alt='Student'
                className='h-32 w-32 rounded-full object-cover'
              />
            ) : (
              <div className='h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center'>
                No Image
              </div>
            )}
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
