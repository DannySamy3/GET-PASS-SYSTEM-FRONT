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
  const [isFront, setIsFront] = useState(true);
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

  useEffect(() => {
    getDetails();
  }, []);

  if (!isOpen) return null; // Return null if modal is not open

  const handlePrint = () => {
    if (cardRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow?.document.write("<html><head><title>Print</title>");
      printWindow?.document.write(
        "<style>@page { size: A4; margin: 0; } body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif; }</style>"
      );
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
      const img = printContent.querySelector("img");
      const details = printContent.querySelector("article");
      const header = printContent.querySelector(".header") as HTMLElement;
      const qrCode = printContent.querySelector(".qr-code") as HTMLElement;

      (details as HTMLElement)?.style.setProperty("font-size", "24px");
      (details as HTMLElement)?.style.setProperty("margin-bottom", "8px"); // Add gap between name, class, and reg no
      header?.style.setProperty("font-size", "28px");
      header?.style.setProperty("font-weight", "bold");
      header?.style.setProperty("text-align", "center"); // Center the header
      header?.style.setProperty("margin-top", "20px"); // Add margin-top to the header
      header?.style.setProperty("margin-bottom", "20px"); // Add margin-top to the header

      // Increase the size of the QR code for the PDF
      const qrCodeClone = qrCode?.cloneNode(true) as HTMLElement;
      qrCodeClone.style.width = "200px";
      qrCodeClone.style.height = "200px";
      qrCodeClone.style.margin = "auto";
      qrCodeClone.style.marginLeft = "35%"; // Move the QR code more to the right
      qrCodeClone.style.marginTop = "13%"; // Move the QR code more to the right
      qrCodeClone.style.marginBottom = "40%"; // Move the QR code more to the right
      qrCode?.replaceWith(qrCodeClone);

      (img as HTMLElement)?.style.setProperty("height", "140px");
      (img as HTMLElement)?.style.setProperty("width", "140px");
      (img as HTMLElement)?.style.setProperty("display", "block");
      (img as HTMLElement)?.style.setProperty("margin", "auto"); // Center the image
      (img as HTMLElement)?.style.setProperty("border-radius", "50%"); // Make the image circular
      (img as HTMLElement)?.style.setProperty("margin-top", "16%"); // Add vertical margin to the image
      (img as HTMLElement)?.style.setProperty("margin-bottom", "15%"); // Add vertical margin to the image

      // Add gap between name, class, and reg no in the PDF
      const nameElement = details?.querySelector("div:nth-child(1)");
      const classElement = details?.querySelector("div:nth-child(2)");
      const regNoElement = details?.querySelector("div:nth-child(3)");

      (nameElement as HTMLElement)?.style.setProperty("margin-bottom", "10px");
      (classElement as HTMLElement)?.style.setProperty("margin-bottom", "10px");
      (regNoElement as HTMLElement)?.style.setProperty("margin-bottom", "10px");

      // Align name, class, and reg no to the left in the PDF
      (nameElement as HTMLElement)?.style.setProperty("text-align", "left");
      (classElement as HTMLElement)?.style.setProperty("text-align", "left");
      (regNoElement as HTMLElement)?.style.setProperty("text-align", "left");

      buttons.forEach((button) => button.remove()); // Remove buttons

      // Arrange the content properly
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "center";
      container.style.width = "4.5in"; // Increase the width
      container.style.height = "6.5in"; // Increase the height
      container.style.padding = "3px"; // Adjust padding to fit content on one page
      container.style.background = "#e0f7fa"; // Bluish background
      container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      container.style.borderRadius = "8px";
      container.appendChild(printContent);

      printWindow?.document.write(container.outerHTML);
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
          {isFront ? (
            <>
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
                    className='h-16 w-16 rounded-full object-cover'
                  />
                ) : (
                  <div className='h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center'>
                    No Image
                  </div>
                )}
              </div>

              {student ? (
                <article className='space-y-2 mt-4 details'>
                  <div className='text-base text-gray-600'>
                    <strong>Name:</strong> {student?.firstName}{" "}
                    {student?.lastName}
                  </div>
                  <div className='text-base text-gray-600'>
                    <strong>Class:</strong> {student?.className}
                  </div>
                  <div className='text-base text-gray-600'>
                    <strong>Reg No:</strong> {student?.regNo}
                  </div>
                </article>
              ) : (
                <div>Loading...</div>
              )}

              {/* QR Code Section */}
              <div className='flex justify-center mt-4 qr-code'>
                <QRCode value={JSON.stringify(qrData)} size={100} />
              </div>
            </>
          ) : (
            <div className='text-center font-bold text-lg text-gray-800 header'>
              Back Side of the Card
              <div className='mt-4 text-base text-gray-600 space-y-2'>
                <p>
                  <strong>University:</strong> XYZ University
                </p>

                <p>
                  <strong>Issued Date:</strong>{" "}
                  {new Date().toLocaleDateString()}
                </p>
                <p>
                  <strong>Valid Until:</strong>{" "}
                  {new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1)
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>If found, please return to:</strong> XYZ University,
                  123 University St, City, Country
                </p>
              </div>
            </div>
          )}

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
            {/* <button
              className='px-4 py-2 bg-green-500 text-white rounded-md ml-2'
              onClick={() => setIsFront(!isFront)} // Toggle between front and back side
            >
              {isFront ? "Show Back" : "Show Front"}
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
