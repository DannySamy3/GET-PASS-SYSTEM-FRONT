import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { getStudentById } from "@/utils/studentController";
import { getClassById } from "@/utils/classController";
import { createRoot } from "react-dom/client";

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
        // console.log("THESE ARE RESULT", result.data.student);
        // @ts-ignore
        const classData = await getClassById(result.data.student.classId);
        console.log("cklass", classData);
        setStudent({
          // @ts-ignore
          ...result.data.student,
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
        "<style>@page { size: landscape; margin: 0; } body { margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif; }</style>"
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
      const header = printContent.querySelector(".header");
      const qrCode = printContent.querySelector(".qr-code");

      // Remove buttons for the ID card design
      buttons.forEach((button) => button.remove());

      // Create a container for the front of the ID card
      const frontContainer = document.createElement("div");
      frontContainer.style.display = "flex";
      frontContainer.style.flexDirection = "column"; // Changed to column to separate header and content
      frontContainer.style.width = "3.375in"; // Standard ID card width
      frontContainer.style.height = "2.125in"; // Standard ID card height
      frontContainer.style.padding = "0";
      frontContainer.style.background = "#29b6f6"; // More vibrant blue matching the image
      frontContainer.style.backgroundImage =
        'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path d="M0,80 Q100,40 200,80 T400,80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M0,100 Q100,60 200,100 T400,100" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/></svg>\'), linear-gradient(135deg, #29b6f6 0%, #4fc3f7 100%)';
      frontContainer.style.backgroundSize = "cover";
      frontContainer.style.borderRadius = "8px";
      frontContainer.style.overflow = "hidden";
      frontContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      frontContainer.style.position = "relative";
      frontContainer.style.marginBottom = "20px"; // Add space between front and back

      // Create a header container for the top part
      const headerContainer = document.createElement("div");
      headerContainer.style.width = "100%";
      headerContainer.style.padding = "8px 0";
      headerContainer.style.display = "flex";
      headerContainer.style.flexDirection = "row"; // Changed to row to place logo and text side by side
      headerContainer.style.alignItems = "center";
      headerContainer.style.justifyContent = "center";

      // Add DMI logo to header
      const logoImg = document.createElement("img");
      logoImg.src =
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dmi-aRE9MLoswU3Y6Hf6kfgLSpySSvQhIz.png"; // Direct URL to the DMI logo
      logoImg.style.width = "38px";
      logoImg.style.height = "38px";
      logoImg.style.marginRight = "10px"; // Add space between logo and text
      logoImg.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      logoImg.style.borderRadius = "50%";
      logoImg.style.padding = "2px";

      // Create a div for the header text
      const headerText = document.createElement("div");
      headerText.style.display = "flex";
      headerText.style.flexDirection = "column";
      headerText.style.alignItems = "flex-start";

      // Create header title if the original header is null
      const headerTitle = document.createElement("div");
      headerTitle.style.fontSize = "14px"; // Reduced font size
      headerTitle.style.fontWeight = "bold";
      headerTitle.style.textAlign = "left";
      headerTitle.style.color = "black";
      headerTitle.style.margin = "0";
      headerTitle.style.padding = "0";
      headerTitle.style.textTransform = "uppercase";
      headerTitle.innerText = "STUDENT IDENTITY CARD";

      // Add institute name
      const institute = document.createElement("div");
      institute.style.fontSize = "11px"; // Reduced font size
      institute.style.fontWeight = "bold";
      institute.style.textAlign = "left";
      institute.style.color = "black";
      institute.style.margin = "0";
      institute.style.padding = "0";
      institute.style.textTransform = "uppercase";
      institute.innerHTML = "DAR ES SALAAM MARITIME INSTITUTE";

      // Add DMI text
      const dmiText = document.createElement("div");
      dmiText.style.fontSize = "11px";
      dmiText.style.fontWeight = "bold";
      dmiText.style.textAlign = "left";
      dmiText.style.color = "black";
      dmiText.style.margin = "0";
      dmiText.style.padding = "0";
      dmiText.style.textTransform = "uppercase";
      dmiText.innerHTML = "DMI";

      // Add header elements to the header text container
      // Use the original header if available, otherwise use the created one
      if (header) {
        const headerClone = header.cloneNode(true) as HTMLElement;
        headerClone.style.fontSize = "14px";
        headerClone.style.fontWeight = "bold";
        headerClone.style.textAlign = "left";
        headerClone.style.color = "black";
        headerClone.style.margin = "0";
        headerClone.style.padding = "0";
        headerClone.style.textTransform = "uppercase";
        headerText.appendChild(headerClone);
      } else {
        headerText.appendChild(headerTitle);
      }

      headerText.appendChild(institute);
      headerText.appendChild(dmiText);

      // Add logo and header text to the header container
      headerContainer.appendChild(logoImg);
      headerContainer.appendChild(headerText);

      // Create a content container for the photo and details
      const contentContainer = document.createElement("div");
      contentContainer.style.display = "flex";
      contentContainer.style.flexDirection = "row";
      contentContainer.style.width = "100%";
      contentContainer.style.marginTop = "15px"; // Add gap between header and content

      // Create a left section for the photo
      const leftSection = document.createElement("div");
      leftSection.style.width = "30%";
      leftSection.style.padding = "0 15px";
      leftSection.style.display = "flex";
      leftSection.style.flexDirection = "column";
      leftSection.style.alignItems = "center";
      leftSection.style.justifyContent = "flex-start"; // Align content to the top

      // Create a right section for the details
      const rightSection = document.createElement("div");
      rightSection.style.width = "70%";
      rightSection.style.padding = "0 15px 15px 0";
      rightSection.style.display = "flex";
      rightSection.style.flexDirection = "column";

      // Style the image if it exists
      if (img) {
        const imgClone = img.cloneNode(true) as HTMLElement;
        imgClone.style.width = "100%";
        imgClone.style.height = "auto";
        imgClone.style.maxWidth = "100px";
        imgClone.style.maxHeight = "120px";
        imgClone.style.borderRadius = "0"; // Square image like in the reference
        imgClone.style.border = "2px solid white";
        imgClone.style.objectFit = "cover";
        imgClone.style.marginBottom = "10px";
        leftSection.appendChild(imgClone);
      } else {
        // Create a placeholder if image doesn't exist
        const placeholderImg = document.createElement("div");
        placeholderImg.style.width = "100px";
        placeholderImg.style.height = "120px";
        placeholderImg.style.backgroundColor = "#e0e0e0";
        placeholderImg.style.border = "2px solid white";
        placeholderImg.style.marginBottom = "10px";
        placeholderImg.style.display = "flex";
        placeholderImg.style.alignItems = "center";
        placeholderImg.style.justifyContent = "center";
        placeholderImg.innerText = "No Image";
        leftSection.appendChild(placeholderImg);
      }

      // Style the details
      if (details) {
        const detailsClone = details.cloneNode(true) as HTMLElement;
        detailsClone.style.fontSize = "12px";
        detailsClone.style.color = "black";
        detailsClone.style.marginTop = "0";

        // Get the detail elements
        const nameElement = detailsClone.querySelector("div:nth-child(1)");
        const classElement = detailsClone.querySelector("div:nth-child(2)");
        const regNoElement = detailsClone.querySelector("div:nth-child(3)");

        // Style each detail element
        if (nameElement) {
          nameElement.innerHTML = nameElement.innerHTML.replace(
            "<strong>Name:</strong>",
            "Name:"
          );
          //@ts-ignore
          nameElement.style.marginBottom = "8px";
          //@ts-ignore
          nameElement.style.fontWeight = "normal";
        }

        if (regNoElement) {
          regNoElement.innerHTML = regNoElement.innerHTML.replace(
            "<strong>Reg No:</strong>",
            "Reg No:"
          );
          //@ts-ignore
          regNoElement.style.marginBottom = "8px";
          //@ts-ignore
          regNoElement.style.fontWeight = "normal";
        }

        // Add gender field
        const genderElement = document.createElement("div");
        genderElement.style.fontSize = "12px";
        genderElement.style.marginBottom = "8px";
        genderElement.innerHTML =
          "Gender: " + (student?.gender || "Not specified");

        // Replace class with program
        if (classElement) {
          classElement.innerHTML = "Programme: " + student?.className;
          //@ts-ignore
          classElement.style.marginBottom = "8px";
          //@ts-ignore
          classElement.style.fontWeight = "normal";
        }

        // Add validity date
        const validityElement = document.createElement("div");
        validityElement.style.fontSize = "12px";
        validityElement.style.marginBottom = "8px";
        validityElement.innerHTML =
          "Valid up to: " +
          new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ).toLocaleDateString();

        // Clear the details and add elements in the right order
        detailsClone.innerHTML = "";
        if (nameElement) detailsClone.appendChild(nameElement);
        if (regNoElement) detailsClone.appendChild(regNoElement);
        detailsClone.appendChild(genderElement);
        if (classElement) detailsClone.appendChild(classElement);
        detailsClone.appendChild(validityElement);

        rightSection.appendChild(detailsClone);
      } else {
        // Create placeholder details if they don't exist
        const placeholderDetails = document.createElement("div");
        placeholderDetails.style.fontSize = "12px";
        placeholderDetails.style.color = "black";

        const nameElement = document.createElement("div");
        nameElement.style.marginBottom = "8px";
        nameElement.innerHTML =
          "Name: " +
          (student?.firstName || "John") +
          " " +
          (student?.lastName || "Doe");

        const regNoElement = document.createElement("div");
        regNoElement.style.marginBottom = "8px";
        regNoElement.innerHTML = "Reg No: " + (student?.regNo || "BMTE/21/025");

        const genderElement = document.createElement("div");
        genderElement.style.marginBottom = "8px";
        genderElement.innerHTML =
          "Gender: " + (student?.gender || "Not specified");

        const programElement = document.createElement("div");
        programElement.style.marginBottom = "8px";
        programElement.innerHTML =
          "Programme: " + (student?.className || "Bachelor of Science");

        const validityElement = document.createElement("div");
        validityElement.style.marginBottom = "8px";
        validityElement.innerHTML =
          "Valid up to: " +
          new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ).toLocaleDateString();

        placeholderDetails.appendChild(nameElement);
        placeholderDetails.appendChild(regNoElement);
        placeholderDetails.appendChild(genderElement);
        placeholderDetails.appendChild(programElement);
        placeholderDetails.appendChild(validityElement);

        rightSection.appendChild(placeholderDetails);
      }

      // Assemble the content sections for front
      contentContainer.appendChild(leftSection);
      contentContainer.appendChild(rightSection);

      // Assemble the front of the card
      frontContainer.appendChild(headerContainer);
      frontContainer.appendChild(contentContainer);

      // Create a container for the back of the ID card
      const backContainer = document.createElement("div");
      backContainer.style.display = "flex";
      backContainer.style.flexDirection = "column";
      backContainer.style.width = "3.375in"; // Standard ID card width
      backContainer.style.height = "2.125in"; // Standard ID card height
      backContainer.style.padding = "0";
      backContainer.style.background = "#ffffff"; // White background
      backContainer.style.borderRadius = "8px";
      backContainer.style.overflow = "hidden";
      backContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      backContainer.style.position = "relative";
      backContainer.style.fontFamily = "Arial, sans-serif";

      // Add magnetic strip at the top
      const magneticStrip = document.createElement("div");
      magneticStrip.style.width = "100%";
      magneticStrip.style.height = "30px";
      magneticStrip.style.backgroundColor = "#000000";
      magneticStrip.style.marginBottom = "8px";

      // Create content for the back
      const backContent = document.createElement("div");
      backContent.style.padding = "0 20px 8px 20px";
      backContent.style.display = "flex";
      backContent.style.flexDirection = "column";
      backContent.style.position = "relative";

      // Add disclaimer text
      const disclaimer = document.createElement("div");
      disclaimer.style.fontSize = "10px";
      disclaimer.style.marginBottom = "8px";
      disclaimer.style.textAlign = "left";
      disclaimer.innerHTML =
        "This Identity Card is the property of DMI and is not transferable, if LOST and FOUND kindly inform:";

      // Add RECTOR text
      const rector = document.createElement("div");
      rector.style.fontSize = "11px";
      rector.style.fontWeight = "bold";
      rector.style.textAlign = "left";
      rector.style.marginBottom = "4px";
      rector.innerHTML = "RECTOR";

      // Add institute name for back
      const instituteBack = document.createElement("div");
      instituteBack.style.fontSize = "11px";
      instituteBack.style.fontWeight = "bold";
      instituteBack.style.textAlign = "left";
      instituteBack.style.marginBottom = "8px";
      instituteBack.innerHTML = "DAR ES SALAAM MARITIME INSTITUTE";

      // Add contact information
      const contactInfo = document.createElement("div");
      contactInfo.style.fontSize = "10px";
      contactInfo.style.textAlign = "left";
      contactInfo.style.marginBottom = "10px";
      contactInfo.style.lineHeight = "1.4";
      contactInfo.innerHTML =
        "Sokoine Drive, P.O Box 6727 Tel: +255 22 2133645<br>Dar es Salaam, Tanzania Website: www.dmi.ac.tz<br>Email: info@dmi.ac.tz";

      // Add QR code to the right bottom
      const qrCodeElement = document.createElement("div");
      qrCodeElement.style.position = "absolute";
      qrCodeElement.style.right = "15px";
      qrCodeElement.style.bottom = "8px";
      qrCodeElement.style.width = "55px";
      qrCodeElement.style.height = "55px";
      qrCodeElement.style.backgroundColor = "#ffffff";
      qrCodeElement.style.display = "flex";
      qrCodeElement.style.alignItems = "center";
      qrCodeElement.style.justifyContent = "center";
      qrCodeElement.style.padding = "0";
      qrCodeElement.style.margin = "0";

      // Create a QR code for the back using the same data as the front
      const qrCodeSvg = document.createElement("div");
      // If we have a QR code in the UI, try to use its SVG content
      if (qrCode) {
        const svgElement = qrCode.querySelector("svg");
        if (svgElement) {
          const svgClone = svgElement.cloneNode(true) as SVGElement;
          svgClone.setAttribute("width", "55");
          svgClone.setAttribute("height", "55");
          qrCodeSvg.innerHTML = svgClone.outerHTML;
        }
      }

      qrCodeElement.appendChild(qrCodeSvg);

      // Add serial number
      const serialNumber = document.createElement("div");
      serialNumber.style.fontSize = "10px";
      serialNumber.style.textAlign = "left";
      serialNumber.style.position = "absolute";
      serialNumber.style.left = "20px";
      serialNumber.style.bottom = "8px";
      serialNumber.innerHTML = `SN:${new Date().getFullYear()}#${
        new Date().getFullYear() + 1
      }-${Math.floor(Math.random() * 10000000000)
        .toString()
        .padStart(11, "0")}`;

      // Assemble the back content
      backContent.appendChild(disclaimer);
      backContent.appendChild(rector);
      backContent.appendChild(instituteBack);
      backContent.appendChild(contactInfo);
      backContent.appendChild(serialNumber);
      backContent.appendChild(qrCodeElement);

      // Assemble the back of the card
      backContainer.appendChild(magneticStrip);
      backContainer.appendChild(backContent);

      // Add both front and back to the print window
      printWindow?.document.write(frontContainer.outerHTML);
      printWindow?.document.write(backContainer.outerHTML);
      printWindow?.document.write("</body></html>");
      printWindow?.document.close();
      printWindow?.print(); // Trigger the print dialog
    }
  };
  return (
    <div
      className='fixed inset-0 bg-gray-800 z-50 flex justify-center items-center'
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
                  src={student.image || "/placeholder.svg?height=150&width=150"}
                  alt='Student'
                  className='h-16 w-16 rounded-full object-cover'
                />
              ) : (
                <div className='h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500'></div>
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
          <div className='bg-white p-4 rounded-lg'>
            <div className='bg-black h-8 -mx-4 -mt-4 mb-3'></div>
            <div className='text-center text-sm mb-2'>
              This Identity Card is the property of DMI and is not transferable,
              if LOST and FOUND kindly inform:
            </div>
            <div className='text-center font-bold mb-1'>RECTOR</div>
            <div className='text-center font-bold mb-2'>
              DAR ES SALAAM MARITIME INSTITUTE
            </div>
            <div className='text-center text-xs mb-3'>
              Sokoine Drive, P.O Box 6727 Tel: +255 22 2133645
              <br />
              Dar es Salaam, Tanzania Website: www.dmi.ac.tz
              <br />
              Email: info@dmi.ac.tz
            </div>
            <div className='text-center text-xs mt-4'>
              SN:{new Date().getFullYear()}#{new Date().getFullYear() + 1}-
              {Math.floor(Math.random() * 10000000000)
                .toString()
                .padStart(11, "0")}
            </div>
            <div className='flex justify-between mt-8 px-4'>
              <div className='w-2/5 text-center'>
                <div className='border-b border-black mb-1'>&nbsp;</div>
                <div className='text-xs font-bold'>Principal's Signature</div>
              </div>
              <div className='w-2/5 text-center'>
                <div className='border-b border-black mb-1'>&nbsp;</div>
                <div className='text-xs font-bold'>Student's Signature</div>
              </div>
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
          <button
            className='px-4 py-2 bg-green-500 text-white rounded-md ml-2'
            onClick={() => setIsFront(!isFront)} // Toggle between front and back side
          >
            {isFront ? "Show Back" : "Show Front"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
