// frontend/components/AttendanceQrDisplay.tsx
import React, { useEffect, useState } from "react";
import { useAttendanceStore } from "../../store/useAttendanceStore";
import { QRCodeSVG } from "qrcode.react";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const AttendanceQrDisplayPage: React.FC = () => {
  const generateQrToken = useAttendanceStore((s) => s.generateQrToken);
  const [qrToken, setQrToken] = useState<string | null>(
    () => localStorage.getItem("cachedQrToken")
  );
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const fetchQr = async () => {
    if (!navigator.onLine) return; // Skip fetching if offline

    setIsLoading(true);
    try {
      const token = await generateQrToken();
      setQrToken(token);
      localStorage.setItem("cachedQrToken", token);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error("Failed to generate QR token", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQr();

    const interval = setInterval(() => {
      if (navigator.onLine) {
        fetchQr();
      }
    }, REFRESH_INTERVAL);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">Employee Attendance</h1>
          <p className="text-center text-indigo-100 mt-1">Scan QR to check in or out</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* QR Container */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 flex flex-col items-center">
            <div className="relative">
              {isLoading && !qrToken ? (
                <div className="w-64 h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : qrToken ? (
                <>
                  <QRCodeSVG
                    value={qrToken}
                    size={256}
                    className="rounded-lg shadow-md border-4 border-white transform transition duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-indigo-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-red-600">QR code unavailable offline.</p>
              )}
            </div>

            <div className="mt-4 text-center">
              {lastRefreshed && (
                <p className="text-sm text-gray-500">QR refreshed at: {formatTime(lastRefreshed)}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">QR code refreshes every 5 minutes</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-800 mb-2">How to use:</h3>
            <ol className="text-sm text-blue-700 list-decimal pl-5 space-y-1">
              <li>Open your company's attendance app</li>
              <li>Tap on the check-in or check-out button</li>
              <li>Point your camera at this code</li>
              <li>Confirm your check-in/out in the app</li>
            </ol>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${isOnline ? "bg-green-500" : "bg-orange-500"}`}
              />
              <span className="text-sm text-gray-700">
                {isOnline
                  ? "System is operational"
                  : "Offline — QR will not refresh until connection is restored"}
              </span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                isOnline ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t">
          Secure QR authentication • {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};
