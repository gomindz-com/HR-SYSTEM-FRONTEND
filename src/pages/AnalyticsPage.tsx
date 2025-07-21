import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const attendanceList = [
  { status: "Present" },
  { status: "Present" },
  { status: "Absent" },
  { status: "Late" },
  { status: "On Leave" },
  { status: "Present" },
  { status: "Present" },
  { status: "Late" },
];
const leaveRequests = [
  { leaveType: "Vacation" },
  { leaveType: "Sick Leave" },
  { leaveType: "Personal" },
  { leaveType: "Maternity" },
  { leaveType: "Annual" },
  { leaveType: "Sick Leave" },
  { leaveType: "Conference" },
  { leaveType: "Business Trip" },
];
const attendanceStats = attendanceList.reduce((acc, a) => {
  acc[a.status] = (acc[a.status] || 0) + 1;
  return acc;
}, {});
const leaveStats = leaveRequests.reduce((acc, l) => {
  acc[l.leaveType] = (acc[l.leaveType] || 0) + 1;
  return acc;
}, {});

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">
          Attendance and leave analytics for GoMindz
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Attendance Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {Object.entries(attendanceStats).map(([status, count]) => (
                <li key={status}>
                  {status}: {count}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Leave Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {Object.entries(leaveStats).map(([type, count]) => (
                <li key={type}>
                  {type}: {count}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
