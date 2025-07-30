// Printable QR Code Page for Attendance
import React from "react";
import { QRCodeSVG } from "qrcode.react";

// Print-specific styles
const printStyles = `
  @media print {
    @page {
      margin: 0.5in;
      size: A4;
    }
    
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    .print-header {
      display: block !important;
    }
    
    .screen-only {
      display: none !important;
    }
    
    .qr-container {
      page-break-inside: avoid;
    }
    
    /* Hide browser's default header and footer */
    @page {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
`;

export const AttendanceQrDisplayPage: React.FC = () => {
  // Static QR code from environment variable
  const qrToken = "ATTENDANCE_QR_2025";

  // Function to handle printing with custom title
  const handlePrint = () => {
    // Store original title
    const originalTitle = document.title;

    // Set custom title for printing
    document.title = "Employee Attendance QR Code";

    // Print
    window.print();

    // Restore original title after printing
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  return (
    <>
      <style>{printStyles}</style>
      <div className="min-h-screen bg-white p-8 print:p-4 qr-container">
        {/* Print Header - Only visible when printing */}
        <div className="print-header hidden print:block text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Employee Attendance QR Code
          </h1>
          <p className="text-lg text-gray-600">Scan to check in or check out</p>
        </div>

        {/* Main Content */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg print:shadow-none print:max-w-none">
          {/* Screen Header - Hidden when printing */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white rounded-t-lg print:hidden">
            <h1 className="text-2xl font-bold text-center">
              Employee Attendance
            </h1>
            <p className="text-center text-indigo-100 mt-1">
              Scan QR to check in or out
            </p>
          </div>

          {/* QR Code Container */}
          <div className="p-8 print:p-4 text-center">
            {/* QR Code */}
            <div className="inline-block p-4 bg-white border-2 border-gray-300 rounded-lg print:border-black relative">
              <QRCodeSVG
                value={qrToken}
                size={300}
                className="print:w-full print:h-auto"
              />
              {/* Logo overlay in the center */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white rounded-full p-1 shadow-lg border-2 border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 print:bg-gray-100">
                <h3 className="font-semibold text-blue-800 print:text-black mb-2">
                  How to use:
                </h3>
                <ol className="text-sm text-blue-700 print:text-black list-decimal pl-5 space-y-1">
                  <li>Open your company's attendance app</li>
                  <li>Tap on the check-in or check-out button</li>
                  <li>Point your camera at this QR code</li>
                  <li>Confirm your check-in/out in the app</li>
                </ol>
              </div>

              {/* Company Info */}
              <div className="bg-gray-50 rounded-lg p-4 print:bg-gray-100">
                <h3 className="font-semibold text-gray-800 print:text-black mb-2">
                  Universal QR Code
                </h3>
                <p className="text-sm text-gray-600 print:text-black">
                  This QR code will not work when you are not in the office
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 rounded-b-lg print:bg-gray-100 print:text-black">
            <p>Secure QR authentication • {new Date().getFullYear()}</p>
            <p className="mt-1">
              Print this page and display it in your office
            </p>
          </div>
        </div>

        {/* Print Instructions - Only visible on screen */}
        <div className="mt-8 text-center print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
          >
            🖨️ Print QR Code
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Click to print this QR code for office display
          </p>
        </div>
      </div>
    </>
  );
};
