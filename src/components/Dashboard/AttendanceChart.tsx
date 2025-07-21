import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const attendanceData = [
  { day: "Mon", present: 138, absent: 4, late: 2 },
  { day: "Tue", present: 142, absent: 2, late: 1 },
  { day: "Wed", present: 135, absent: 7, late: 3 },
  { day: "Thu", present: 140, absent: 2, late: 2 },
  { day: "Fri", present: 134, absent: 8, late: 1 },
  { day: "Sat", present: 67, absent: 1, late: 0 },
  { day: "Sun", present: 23, absent: 0, late: 0 },
];

export function AttendanceChart() {
  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Weekly Attendance Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Employee attendance trends for this week</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="day" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
                boxShadow: "var(--shadow-dropdown)",
              }}
            />
            <Bar 
              dataKey="present" 
              fill="hsl(var(--hr-chart-3))" 
              name="Present"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="late" 
              fill="hsl(var(--hr-chart-5))" 
              name="Late"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="absent" 
              fill="hsl(var(--destructive))" 
              name="Absent"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}