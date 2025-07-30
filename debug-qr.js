// QR Debugging Script - Run this in browser console
console.log("🔍 QR Debugging Script Started");

// Test 1: Check if user is authenticated
async function checkAuth() {
  try {
    const response = await fetch("/api/auth/check-auth", {
      credentials: "include",
    });
    console.log("✅ Auth check response:", response.status);
    if (response.ok) {
      const data = await response.json();
      console.log("✅ User authenticated:", data);
    } else {
      console.log("❌ User not authenticated");
    }
  } catch (error) {
    console.log("❌ Auth check failed:", error);
  }
}

// Test 2: Test QR validation with sample data
async function testQRValidation() {
  try {
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

    console.log("✅ QR test response status:", response.status);
    const data = await response.json();
    console.log("✅ QR test response:", data);
  } catch (error) {
    console.log("❌ QR test failed:", error);
  }
}

// Test 3: Check API connectivity
async function checkAPI() {
  try {
    const response = await fetch("/api/attendance/stats", {
      credentials: "include",
    });
    console.log("✅ API connectivity test:", response.status);
  } catch (error) {
    console.log("❌ API connectivity failed:", error);
  }
}

// Run all tests
console.log("🧪 Running QR debugging tests...");
checkAuth();
testQRValidation();
checkAPI();

console.log("📋 Debugging tests completed. Check console for results.");
