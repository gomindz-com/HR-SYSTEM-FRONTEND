import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAttendanceStore } from "../../../store/useAttendanceStore";
import { Html5Qrcode } from "html5-qrcode";
import toast from "react-hot-toast";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [permissionRetryCount, setPermissionRetryCount] = useState(0);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initAttemptedRef = useRef(false);

  // Memoize the scan handlers to prevent re-creation
  const handleScanSuccess = useCallback(
    async (decodedText: string, decodedResult: any) => {
      console.log("✅ QR Code detected:", decodedText);
      console.log("📊 Decoded result:", decodedResult);
      if (!isProcessing) {
        setIsProcessing(true);
        setResult(null);
        setError(null);

        // Stop the scanner immediately to prevent multiple scans
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
            console.log("🛑 Scanner stopped after successful detection");
          } catch (err) {
            console.warn("Error stopping scanner:", err);
          }
        }

        try {
          if (mode === "check-in") {
            await checkIn(decodedText);
          } else {
            await checkOut(decodedText);
          }
          if (onSuccess) onSuccess();
        } catch (err) {
          setError("❌ Failed to check in/out. Please try again.");
          // Restart scanner if there was an error
          if (scannerRef.current && hasCameraSupport) {
            try {
              await scannerRef.current.start(
                { facingMode: "environment" },
                {
                  fps: 10,
                  qrbox: { width: 250, height: 250 },
                  aspectRatio: 1.0,
                },
                handleScanSuccess,
                handleScanError
              );
            } catch (restartErr) {
              console.error("Failed to restart scanner:", restartErr);
            }
          }
        } finally {
          setIsProcessing(false);
        }
      }
    },
    [mode, checkIn, checkOut, onSuccess, isProcessing, hasCameraSupport]
  );

  const handleScanError = useCallback((errorMessage: string) => {
    // Suppress non-fatal errors
    const ignoredErrors = [
      "NotFoundError",
      "No QR code found",
      "NotAllowedError",
      "AbortError",
      "NotReadableError",
      "OverconstrainedError",
      "NotFoundException",
      "No MultiFormat Readers were able to detect the code",
    ];

    const isIgnored = ignoredErrors.some((msg) => errorMessage.includes(msg));

    if (!isIgnored) {
      console.warn("Camera scan error:", errorMessage);
    }
    // Remove console.log for ignored errors to prevent spam
  }, []);

  // Improved camera permission check with retry mechanism
  const checkCameraPermission = useCallback(
    async (retryCount = 0): Promise<boolean> => {
      console.log(`🔍 Checking camera support... (attempt ${retryCount + 1})`);
      setDebugInfo(`Checking camera support... (attempt ${retryCount + 1})`);

      if (
        typeof navigator !== "undefined" &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function"
      ) {
        try {
          console.log("📱 MediaDevices API available");
          setDebugInfo("MediaDevices API available, requesting camera...");

          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          });

          console.log("✅ Camera access granted", stream);
          setDebugInfo("Camera access granted");
          setHasCameraSupport(true);

          // Stop the test stream
          stream.getTracks().forEach((track) => track.stop());
          return true;
        } catch (err) {
          console.error("❌ Camera access denied:", err);
          setDebugInfo(
            `Camera access denied: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );

          // Retry logic for permission issues
          if (
            retryCount < 2 &&
            err instanceof Error &&
            (err.name === "NotAllowedError" ||
              err.name === "PermissionDeniedError")
          ) {
            console.log(
              `🔄 Retrying camera permission... (${retryCount + 1}/2)`
            );
            setDebugInfo(`Retrying camera permission... (${retryCount + 1}/2)`);

            // Wait a bit before retry
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return checkCameraPermission(retryCount + 1);
          }

          setHasCameraSupport(false);
          return false;
        }
      } else {
        console.error("❌ MediaDevices API not available");
        setDebugInfo("MediaDevices API not available");
        setHasCameraSupport(false);
        return false;
      }
    },
    []
  );

  useEffect(() => {
    async function initializeCamera() {
      setCameraChecked(false);
      setPermissionRetryCount(0);
      const hasPermission = await checkCameraPermission();
      setCameraChecked(true);
      return hasPermission;
    }
    initializeCamera();
  }, [checkCameraPermission]);

  // Cleanup function to properly release camera resources
  const cleanupScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        console.log("🧹 Cleaning up scanner...");
        await scannerRef.current.stop();
        console.log("✅ Scanner stopped successfully");
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      } finally {
        scannerRef.current = null;
        setScannerInitialized(false);
        initAttemptedRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttemptedRef.current) {
      return;
    }

    if (
      hasCameraSupport &&
      cameraChecked &&
      containerRef.current &&
      !scannerRef.current &&
      !scannerInitialized
    ) {
      initAttemptedRef.current = true;
      console.log("🚀 Initializing QR scanner...");
      setDebugInfo("Initializing QR scanner...");

      // Add a small delay to ensure DOM is ready
      const initTimer = setTimeout(async () => {
        try {
          // Check if container still exists
          const container = document.getElementById("qr-reader-container");
          if (!container) {
            console.error("❌ Container not found");
            setDebugInfo("Container not found");
            setError("Container not found");
            return;
          }

          console.log("📦 Container found, creating scanner...");
          setDebugInfo("Container found, creating scanner...");

          // Initialize the scanner
          scannerRef.current = new Html5Qrcode("qr-reader-container");

          console.log("📷 Scanner created, starting camera...");
          setDebugInfo("Scanner created, starting camera...");

          // Start the camera with proper format support
          await scannerRef.current.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
            },
            handleScanSuccess,
            handleScanError
          );

          console.log("✅ Scanner started successfully");
          setDebugInfo("Scanner started successfully");
          setScannerInitialized(true);
        } catch (err) {
          console.error("❌ Failed to initialize scanner:", err);
          setDebugInfo(
            `Scanner initialization failed: ${
              err instanceof Error ? err.message : "Unknown error"
            }`
          );
          setError("Failed to initialize camera scanner");
          // Reset the flag to allow retry
          initAttemptedRef.current = false;
        }
      }, 100); // 100ms delay

      // Cleanup timer
      return () => clearTimeout(initTimer);
    }

    // Cleanup function
    return () => {
      cleanupScanner();
    };
  }, [
    hasCameraSupport,
    cameraChecked,
    handleScanSuccess,
    handleScanError,
    cleanupScanner,
  ]);

  // Add retry button functionality
  const handleRetryCamera = async () => {
    setError(null);
    setCameraChecked(false);
    setScannerInitialized(false);
    initAttemptedRef.current = false;

    // Clean up existing scanner
    await cleanupScanner();

    // Re-check camera permissions
    const hasPermission = await checkCameraPermission();
    setCameraChecked(true);

    if (hasPermission) {
      // Force re-initialization
      initAttemptedRef.current = false;
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
        <div className="text-red-600 space-y-2">
          <p>❌ Camera not supported. Use a modern browser and allow access.</p>
          <button
            onClick={handleRetryCamera}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Retry Camera Access
          </button>
        </div>
      ) : (
        <div className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden shadow-lg border-4 border-black">
          {!isProcessing ? (
            <div
              id="qr-reader-container"
              ref={containerRef}
              className="w-full h-full"
              style={{ minHeight: "300px" }}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm font-medium text-gray-600">
                  Processing...
                </p>
              </div>
            </div>
          )}
          {/* Optional scanning overlay */}
          <div className="absolute inset-0 border-4 border-white/30 pointer-events-none" />
        </div>
      )}

      {result && <p className="text-green-600">{result}</p>}
      {error && (
        <div className="text-red-600 space-y-2">
          <p>{error}</p>
          <button
            onClick={handleRetryCamera}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Retry Camera Access
          </button>
        </div>
      )}

      {/* Debug info for development */}
    </div>
  );
};
