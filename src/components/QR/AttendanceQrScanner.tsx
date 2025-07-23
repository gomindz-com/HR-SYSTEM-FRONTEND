import React, { useState } from "react";
import { useAttendanceStore } from "../../../store/useAttendanceStore";
import { QrReader } from "react-qr-reader";

// Type for the mode prop
type Mode = "check-in" | "check-out";

export const AttendanceQrScanner: React.FC<{ mode: Mode }> = ({ mode }) => {
  const { checkIn, checkOut } = useAttendanceStore();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // QrReader onResult gives (result: Result | null, error: Error | null)
  // 'Result' type is not exported from 'react-qr-reader', so we use 'any' here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScan = async (result: any, error: Error | null) => {
    if (result) {
      const text = result.getText();
      if (text) {
        setResult(null);
        setError(null);
        try {
          if (mode === "check-in") {
            await checkIn(text);
            setResult("Check-in successful!");
          } else {
            await checkOut(text);
            setResult("Check-out successful!");
          }
        } catch (err: unknown) {
          setError("Failed to check in/out. Please try again.");
        }
      }
    } else if (error) {
      setError("Camera error: " + error.message);
    }
  };

  return (
    <div>
      <h2>{mode === "check-in" ? "Check In" : "Check Out"}</h2>
      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={handleScan}
      />
      {result && <p style={{ color: "green" }}>{result}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
