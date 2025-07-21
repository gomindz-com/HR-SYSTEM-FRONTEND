import { useState } from "react";
import {
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Building,
  AlertTriangle,
} from "lucide-react";
import { MetricsCard } from "@/components/Dashboard/MetricsCard";
import { AttendanceChart } from "@/components/Dashboard/AttendanceChart";
import { DepartmentChart } from "@/components/Dashboard/DepartmentChart";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";

// Import the same mock data as in EmployeesPage, AttendancePage, LeavePage, PerformancePage
const employees = [
  { name: "Ebrima Jallow" },
  { name: "Fatou Camara" },
  { name: "Lamin Sanyang" },
  { name: "Awa Ceesay" },
  { name: "Modou Bah" },
  { name: "Isatou Touray" },
  { name: "Fatoumatta Danso" },
  { name: "Ndey Samba" },
];
const attendanceList = [
  { employeeName: "Ebrima Jallow", status: "Present", date: "2024-06-10" },
  { employeeName: "Fatou Camara", status: "Present", date: "2024-06-10" },
  { employeeName: "Lamin Sanyang", status: "Absent", date: "2024-06-10" },
  { employeeName: "Awa Ceesay", status: "Late", date: "2024-06-10" },
  { employeeName: "Modou Bah", status: "On Leave", date: "2024-06-10" },
  { employeeName: "Isatou Touray", status: "Present", date: "2024-06-10" },
  { employeeName: "Fatoumatta Danso", status: "Present", date: "2024-06-10" },
  { employeeName: "Ndey Samba", status: "Late", date: "2024-06-10" },
];
const leaveRequests = [
  { status: "Pending" },
  { status: "Approved" },
  { status: "Rejected" },
  { status: "Pending" },
  { status: "Approved" },
  { status: "Pending" },
  { status: "Pending" },
  { status: "Approved" },
];
const reviews = [
  { status: "Completed" },
  { status: "Completed" },
  { status: "In Progress" },
  { status: "Completed" },
  { status: "Completed" },
  { status: "Completed" },
  { status: "Completed" },
  { status: "Completed" },
];

const today = "2024-06-10";
const totalEmployees = employees.length;
const totalAttendance = attendanceList.filter((a) => a.date === today).length;
const presentCount = attendanceList.filter(
  (a) => a.status === "Present" && a.date === today
).length;
const lateCount = attendanceList.filter(
  (a) => a.status === "Late" && a.date === today
).length;
const attendanceRate =
  totalAttendance > 0
    ? Math.round(((presentCount + lateCount) / totalAttendance) * 1000) / 10
    : 0;
const pendingLeaves = leaveRequests.filter(
  (l) => l.status === "Pending"
).length;
const completedReviews = reviews.filter((r) => r.status === "Completed").length;

const Index = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">HR Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening in your organization today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Employees"
          value={totalEmployees}
          subtitle="Active workforce"
          icon={Users}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricsCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle="Today"
          icon={Clock}
          trend={{ value: 0, isPositive: true }}
        />
        <MetricsCard
          title="Pending Leaves"
          value={pendingLeaves}
          subtitle="Awaiting approval"
          icon={Calendar}
          trend={{ value: 0, isPositive: false }}
        />
        <MetricsCard
          title="Completed Reviews"
          value={completedReviews}
          subtitle="This quarter"
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart />
        <DepartmentChart />
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-2">
        <RecentActivity />
      </div>
      {/* Quick Actions and Alert Card remain unchanged */}
    </div>
  );
};

export default Index;
