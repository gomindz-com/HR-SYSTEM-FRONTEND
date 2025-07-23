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

function ProtectedRoute({ children }) {
  const { checkingAuth, authUser } = useAuthStore();
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  if (!authUser) {
    return <Navigate to="/login" />;
  }
  return children;
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

// Utility function to match path patterns (supports :param dynamic segments)
function matchPathPattern(pattern, path) {
  if (!pattern.includes(":")) return pattern === path;
  // Convert pattern to regex: /reset-password/:token => ^/reset-password/[^/]+$
  const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
  return regex.test(path);
}

function App() {
  const { checkAuth, checkingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loader while checking auth
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Only render routes after auth check is complete
  return (
    <div className="flex-1 flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            whiteSpace: "nowrap",
            width: "auto",
            background: "#052E16",
            color: "#46D57A",
            maxWidth: "none",
          },
          error: {
            style: {
              background: "#7F1D1D",
              color: "#FCA5A5",
            },
          },
        }}
      />
      <Routes>
        {/* Public and Auth Routes */}
        <Route
          path="/"
          element={ <HomePage />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/company-signup"
          element={!authUser ? <CompanySignup /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/forgot-password"
          element={
            !authUser ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            !authUser ? <ResetPasswordPage /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/accept-invitation/:token"
          element={
            !authUser ? <AcceptInvitationPage /> : <Navigate to="/dashboard" />
          }
        />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <Index />
                </main>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/employees"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <EmployeesPage />
                </main>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/attendance"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <AttendancePage />
                </main>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/leave"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <LeavePage />
                </main>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/performance"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <PerformancePage />
                </main>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/payroll"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <PayrollPage />
                </main>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/reports"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <ReportsPage />
                </main>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <AnalyticsPage />
                </main>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <NotificationsPage />
                </main>
              </AppLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/settings"
          element={
            authUser ? (
              <AppLayout>
                <main className="flex-1 p-6 overflow-auto">
                  <SettingsPage />
                </main>
              </AppLayout>
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
