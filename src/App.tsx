import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Index from "./pages/Index";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";
import LeavePage from "./pages/LeavePage";
import PerformancePage from "./pages/PerformancePage";
import PayrollPage from "./pages/PayrollPage";
import ReportsPage from "./pages/ReportsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import CompanySignup from "./pages/CompanySignup";
import { AppSidebar } from "./components/Layout/AppSidebar";
import { Header } from "./components/Layout/Header";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import AcceptInvitationPage from "./pages/AcceptInvitationPage";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { AttendanceQrDisplayPage } from "./pages/AttendanceQRDisplayPage";
import EmployeePortal from "./pages/EmployeePortal";
import HRChoicePage from "./pages/HRChoicePage";
import UserProfilePage from "./pages/UserProfilePage";

function FullScreenLayout({ children }) {
  const { checkAuth, authUser, checkingAuth } = useAuthStore();

  // log the authuser on a use effect
  useEffect(() => {
    console.log("Auth User:", authUser);
  }, [authUser]);

  console.log("AuthUser", authUser);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return <div className="min-h-screen w-full bg-background">{children}</div>;
}
const queryClient = new QueryClient();

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
}

// ...existing imports...

function App() {
  const { checkAuth, checkingAuth, authUser } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setAuthChecked(true);
    };
    verifyAuth();
  }, [checkAuth]);

  if (!authChecked || checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  // Helper to check if user is EMPLOYEE

  // Show loader while checking auth
  const isEmployee = authUser?.role === "EMPLOYEE";

  console.log("authUser at route render:", authUser);
  console.log("authChecked:", authChecked);
  console.log("checkingAuth:", checkingAuth);

  // Only render routes after auth check is complete
  return (
    <div className="flex-1 flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            whiteSpace: "nowrap",
            width: "auto",
            background: "#8ecae6",
            color: "#46D57A",
            maxWidth: "none",
          },
          error: {
            style: {
              background: "#c1121f",
              color: "#FCA5A5",
            },
          },
        }}
      />
      <Routes>
        {/* Public and Auth Routes */}
        <Route
  path="/"
  element={
    !authUser ? (
      <FullScreenLayout>  // ✅ Add this wrapper
        <HomePage />
      </FullScreenLayout>
    ) : isEmployee ? (
      <Navigate to="/my-portal" replace />
    ) : authUser.role === "HR" ? (
      <Navigate to="/hr-choice" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    )
  }
/>        <Route
          path="/attendance-qr"
          element={
            authUser && authUser.role === "HR" ? (
              <FullScreenLayout>
                <AttendanceQrDisplayPage />
              </FullScreenLayout>
            ) : authUser ? (
              // If logged in but not HR, redirect to dashboard or my-portal
              authUser.role === "EMPLOYEE" ? (
                <Navigate to="/my-portal" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              // If not logged in, redirect to login
              <Navigate to="/login" />
            )
          }
        />{" "}
        <Route
          path="/my-portal"
          element={
            authUser && (isEmployee || authUser.role === "HR") ? (
              <EmployeePortal />
            ) : authUser && !isEmployee && authUser.role !== "HR" ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/hr-choice"
          element={
            authUser && authUser.role === "HR" ? (
              <FullScreenLayout>
                <HRChoicePage />
              </FullScreenLayout>
            ) : authUser ? (
              <Navigate to={isEmployee ? "/my-portal" : "/dashboard"} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !authUser ? (
              <LoginPage />
            ) : isEmployee ? (
              <Navigate to="/my-portal" />
            ) : authUser.role === "HR" ? (
              <Navigate to="/hr-choice" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/company-signup"
          element={
            !authUser ? (
              <CompanySignup />
            ) : isEmployee ? (
              <Navigate to="/my-portal" />
            ) : authUser.role === "HR" ? (
              <Navigate to="/hr-choice" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            !authUser ? (
              <ForgotPasswordPage />
            ) : isEmployee ? (
              <Navigate to="/my-portal" />
            ) : authUser.role === "HR" ? (
              <Navigate to="/hr-choice" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            !authUser ? (
              <ResetPasswordPage />
            ) : isEmployee ? (
              <Navigate to="/my-portal" />
            ) : authUser.role === "HR" ? (
              <Navigate to="/hr-choice" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/accept-invitation/:token"
          element={
            !authUser ? (
              <AcceptInvitationPage />
            ) : isEmployee ? (
              <Navigate to="/my-portal" />
            ) : authUser.role === "HR" ? (
              <Navigate to="/hr-choice" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        {/* Protected Routes */}
        <Route
          path="/user-profile"
          element={authUser ? <UserProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <Index />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/employees"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <EmployeesPage />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/attendance"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <AttendancePage />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/leave"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <LeavePage />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/performance"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <PerformancePage />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/payroll"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <PayrollPage />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/reports"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <ReportsPage />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <AnalyticsPage />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <NotificationsPage />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            authUser ? (
              isEmployee ? (
                <Navigate to="/my-portal" />
              ) : (
                <AppLayout>
                  <main className="flex-1 p-6 overflow-auto">
                    <SettingsPage />
                  </main>
                </AppLayout>
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

// ...existing RootApp export...
export default function RootApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
