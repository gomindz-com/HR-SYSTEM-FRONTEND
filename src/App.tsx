import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AppSidebar } from "./components/Layout/AppSidebar";
import { Header } from "./components/Layout/Header";
import { Toaster } from "react-hot-toast";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Sonner /> */}
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

      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <Header />
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
              <main className="flex-1 p-6 overflow-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/employees" element={<EmployeesPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/leave" element={<LeavePage />} />
                  <Route path="/performance" element={<PerformancePage />} />
                  <Route path="/payroll" element={<PayrollPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
