import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  {
    employeeName: "Ebrima Jallow",
    status: "Pending",
    leaveType: "Vacation",
    startDate: "2024-06-20",
    endDate: "2024-06-25",
  },
  {
    employeeName: "Fatou Camara",
    status: "Approved",
    leaveType: "Sick Leave",
    startDate: "2024-06-12",
    endDate: "2024-06-14",
  },
  {
    employeeName: "Lamin Sanyang",
    status: "Rejected",
    leaveType: "Personal",
    startDate: "2024-06-18",
    endDate: "2024-06-18",
  },
  {
    employeeName: "Awa Ceesay",
    status: "Pending",
    leaveType: "Maternity",
    startDate: "2024-07-01",
    endDate: "2024-10-01",
  },
  {
    employeeName: "Modou Bah",
    status: "Approved",
    leaveType: "Annual",
    startDate: "2024-06-15",
    endDate: "2024-06-30",
  },
  {
    employeeName: "Isatou Touray",
    status: "Pending",
    leaveType: "Sick Leave",
    startDate: "2024-06-11",
    endDate: "2024-06-13",
  },
  {
    employeeName: "Fatoumatta Danso",
    status: "Pending",
    leaveType: "Conference",
    startDate: "2024-06-22",
    endDate: "2024-06-24",
  },
  {
    employeeName: "Ndey Samba",
    status: "Approved",
    leaveType: "Business Trip",
    startDate: "2024-06-16",
    endDate: "2024-06-18",
  },
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

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Summary of HR data for GoMindz</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {totalEmployees}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {attendanceRate}%
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Leaves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {pendingLeaves}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {completedReviews}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Employee</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.slice(0, 5).map((a, i) => (
                  <tr key={i}>
                    <td>{a.employeeName}</td>
                    <td>{a.status}</td>
                    <td>{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Employee</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">From</th>
                  <th className="text-left">To</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.slice(0, 5).map((l, i) => (
                  <tr key={i}>
                    <td>{l.employeeName}</td>
                    <td>{l.leaveType}</td>
                    <td>{l.status}</td>
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
