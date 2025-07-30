import React, { useState, useEffect } from "react";
import { useAttendanceStore } from "../../../store/useAttendanceStore";
import { QrReader } from "react-qr-reader";
import toast from "react-hot-toast";
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
  const { checkIn, checkOut } = useAttendanceStore();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraChecked, setCameraChecked] = useState(false);
  const [hasCameraSupport, setHasCameraSupport] = useState(true);

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
      if (text) {
        setResult(null);
        setError(null);
        try {
          if (mode === "check-in") {
            await checkIn(text);
            setResult("✅ Check-in successful!");
          } else {
            await checkOut(text);
            setResult("✅ Check-out successful!");
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
  );
};
