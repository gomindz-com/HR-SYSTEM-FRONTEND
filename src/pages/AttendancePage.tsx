import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Search, QrCode } from "lucide-react";
import { useAttendanceStore } from "../../store/useAttendanceStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AttendancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { fetchAttendance, attendanceList } = useAttendanceStore();

  useEffect(() => {
    fetchAttendance({
      page: 1,
      pageSize: 50,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredAttendance = useMemo(() => {
    if (!attendanceList) return [];
    return attendanceList.filter((record: any) => {
      const name = record.employee?.name || "";
      const email = record.employee?.email || "";
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [attendanceList, searchTerm]);

  // Stats — use filtered list if available
  const presentCount = attendanceList.filter((a: any) => a.status === "PRESENT").length;
  const absentCount = attendanceList.filter((a: any) => a.status === "ABSENT").length;
  const lateCount = attendanceList.filter((a: any) => a.status === "LATE").length;
  const totalCount = attendanceList.length;
  const attendanceRate =
    totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 1000) / 10 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return "bg-success/10 text-success";
      case "ABSENT":
        return "bg-destructive/10 text-destructive";
      case "LATE":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">
            Attendance & Time Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor employee attendance and manage time tracking
          </p>
        </div>
        <a
          href="/attendance-qr"
          className="flex items-center gap-4 bg-primary p-3 rounded-lg text-white hover:bg-primary/90 transition-colors"
        >
          <QrCode className="h-6 w-6" />
          <span>Show QR Code</span>
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Present
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{presentCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{absentCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Late Arrivals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lateCount}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">All Records</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="ON_TIME">On Time</SelectItem>
              <SelectItem value="ABSENT">Absent</SelectItem>
              <SelectItem value="LATE">Late</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Attendance Table */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>

                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No attendance records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendance.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            record.employee?.profilePic ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(record.employee?.name || "Employee")}`
                          }
                          alt={record.employee?.name || "Employee"}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <span>{record.employee?.name || record.employeeId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{record.employee?.email || "-"}</TableCell>
                    <TableCell>
                      {record.date
                        ? new Date(record.date).toLocaleDateString([], {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {record.timeIn
                        ? new Date(record.timeIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {record.timeOut
                        ? new Date(record.timeOut).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
