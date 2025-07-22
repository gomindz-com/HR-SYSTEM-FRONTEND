import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
  const location = useLocation();
  // list routes without header/sidebar
  const minimalLayoutRoutes = [
    "/company-signup",
    "/login",
    "/forgot-password",
    "/reset-password/:token",
    "/",
  ];
  const isMinimal = minimalLayoutRoutes.some((pattern) =>
    matchPathPattern(pattern, location.pathname)
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Global Toaster */}
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

      {isMinimal ? (
        <main className="">
          <Routes>
            <Route path="/company-signup" element={<CompanySignup />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/" element={<HomePage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      ) : (
        <AppLayout>
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave" element={<LeavePage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </AppLayout>
      )}
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
