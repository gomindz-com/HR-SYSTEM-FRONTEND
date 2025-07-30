import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const AuthDebugger: React.FC = () => {
  const { authUser, checkAuth, logout } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const testAuth = async () => {
    try {
      console.log("🔍 Testing authentication...");

      // Test 1: Check cookies
      const cookies = document.cookie;
      console.log("🍪 Cookies:", cookies);

      // Test 2: Check localStorage
      const authStorage = localStorage.getItem("auth-storage");
      console.log("💾 Auth Storage:", authStorage);

      // Test 3: Test API call
      const response = await fetch("/api/auth/check-auth", {
        credentials: "include",
      });

      const data = await response.json();
      console.log("📡 API Response:", { status: response.status, data });

      setDebugInfo({
        cookies,
        authStorage,
        apiStatus: response.status,
        apiData: data,
        authUser,
      });
    } catch (error) {
      console.error("❌ Auth test failed:", error);
      setDebugInfo({ error: error.message });
    }
  };

  const testQRAPI = async () => {
    try {
      console.log("🔍 Testing QR API...");

      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          qrPayload: "ATTENDANCE_QR_2025",
        }),
      });

      const data = await response.json();
      console.log("📡 QR API Response:", { status: response.status, data });

      setDebugInfo((prev) => ({
        ...prev,
        qrApiStatus: response.status,
        qrApiData: data,
      }));
    } catch (error) {
      console.error("❌ QR API test failed:", error);
      setDebugInfo((prev) => ({
        ...prev,
        qrApiError: error.message,
      }));
    }
  };

  if (!authUser) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-4">
        <CardHeader>
          <CardTitle>🔍 Authentication Debugger</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">❌ User not authenticated</p>
          <Button onClick={testAuth} className="mr-2">
            Test Auth Status
          </Button>
          {debugInfo && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>🔍 Authentication Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-green-600 mb-2">✅ User authenticated</p>
          <p>
            <strong>Name:</strong> {authUser.name}
          </p>
          <p>
            <strong>Email:</strong> {authUser.email}
          </p>
          <p>
            <strong>Role:</strong> {authUser.role}
          </p>
          <p>
            <strong>Company ID:</strong> {authUser.companyId}
          </p>
        </div>

        <div className="space-x-2 mb-4">
          <Button onClick={testAuth} variant="outline">
            Test Auth Status
          </Button>
          <Button onClick={testQRAPI} variant="outline">
            Test QR API
          </Button>
          <Button onClick={logout} variant="destructive">
            Logout
          </Button>
        </div>

        {debugInfo && (
          <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
};
