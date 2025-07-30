import React, { useState, useEffect } from "react";
import { useAttendanceStore } from "../../../store/useAttendanceStore";
import { QrReader } from "react-qr-reader";
import { Result } from "@zxing/library";

type Mode = "check-in" | "check-out";

type AttendanceQrScannerProps = {
  mode: Mode;
  onSuccess?: () => void;
};

export const AttendanceQrScanner: React.FC<AttendanceQrScannerProps> = ({
  mode,
  onSuccess,
}) => {
  const { checkIn, checkOut, isCheckingIn, isCheckingOut } =
    useAttendanceStore();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraChecked, setCameraChecked] = useState(false);
  const [hasCameraSupport, setHasCameraSupport] = useState(true);
  const isProcessing = mode === "check-in" ? isCheckingIn : isCheckingOut;

  useEffect(() => {
    async function checkCamera() {
      if (
        typeof navigator !== "undefined" &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function"
      ) {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraSupport(true);
        } catch {
          setHasCameraSupport(false);
        }
      } else {
        setHasCameraSupport(false);
      }
      setCameraChecked(true);
    }
    checkCamera();
  }, []);

  const handleScan = async (result: Result | null, error: Error | null) => {
    if (result) {
      const text = result.getText?.();
      if (text && !isProcessing) {
        setResult(null);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 100));

        try {
          if (mode === "check-in") {
            await checkIn(text);
          } else {
            await checkOut(text);
          }
          if (onSuccess) onSuccess();
        } catch (err) {
          setError("❌ Failed to check in/out. Please try again.");
        }
      }
    } else if (error) {
      // Suppress non-fatal errors like "NotFoundError" (e.g., no QR in view)
      const ignoredErrors = [
        "NotFoundError",
        "No QR code found",
        "NotAllowedError",
        "AbortError",
      ];

      const isIgnored = ignoredErrors.some((msg) =>
        error.message?.includes(msg)
      );

      if (!isIgnored) {
        console.warn("Camera scan error:", error.message);
        setError("Camera error: " + error.message);
      }
    }
  };

  return (
    <>
      {/* Full-screen loader */}
      {isProcessing && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              {/* Animated check-in/out icon */}
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {mode === "check-in" ? "📥" : "📤"}
                  </span>
                </div>
              </div>

              {/* Spinning border */}
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {mode === "check-in" ? "Checking In..." : "Checking Out..."}
            </h2>
            <p className="text-gray-600">
              Please wait while we process your request
            </p>
          </div>
        </div>
      )}

      {/* Main scanner component */}
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-lg font-bold">
          {mode === "check-in" ? "Scan to Check In" : "Scan to Check Out"}
        </h2>

        {!cameraChecked ? (
          <p className="text-gray-500">📷 Initializing camera...</p>
        ) : !hasCameraSupport ? (
          <p className="text-red-600">
            ❌ Camera not supported. Use a modern browser and allow access.
          </p>
        ) : (
          <div className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden shadow-lg border-4 border-black">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={handleScan}
              videoStyle={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* Optional scanning overlay */}
            <div className="absolute inset-0 border-4 border-white/30 pointer-events-none" />
          </div>
        )}

        {result && <p className="text-green-600">{result}</p>}
      </div>
    </>
  );
};
