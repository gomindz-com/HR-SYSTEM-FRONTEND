import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, Search, QrCode, Calendar, X } from "lucide-react";
import { useAttendanceStore } from "../../store/useAttendanceStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AttendancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const {
    fetchAttendance,
    attendanceList,
    attendancePagination,
    getAttendanceStats,
    gettingStats,
    attendanceStats,
  } = useAttendanceStore();

  useEffect(() => {
    fetchAttendance({
      page: 1,
      pageSize: 20,
      status: statusFilter !== "ALL" ? statusFilter : undefined,
      date: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
    });
    // Fetch stats from API
    getAttendanceStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFilter]);

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

  // Stats — use API data for more accurate statistics
  const onTimeCount = attendanceStats.daysOnTime || 0;
  const absentCount = attendanceStats.daysAbsent || 0;
  const lateCount = attendanceStats.daysLate || 0;
  const attendanceRate = attendanceStats.attendancePercentage || 0;

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return "On Time";
      case "ABSENT":
        return "Absent";
      case "LATE":
        return "Late";
      default:
        return status;
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
              On Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {gettingStats ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-success mx-auto"></div>
              ) : (
                onTimeCount
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Absent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {gettingStats ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-destructive mx-auto"></div>
              ) : (
                absentCount
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Late
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {gettingStats ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-warning mx-auto"></div>
              ) : (
                lateCount
              )}
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
              {gettingStats ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              ) : (
                `${attendanceRate}%`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {gettingStats ? "Loading..." : "Company-wide Stats"}
            </p>
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

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dateFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateFilter(undefined)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {(dateFilter || statusFilter !== "ALL") && (
          <div className="text-sm text-muted-foreground">
            Filters:{" "}
            {statusFilter !== "ALL" && `${getStatusLabel(statusFilter)}`}
            {dateFilter && statusFilter !== "ALL" && " • "}
            {dateFilter && `${format(dateFilter, "MMM dd, yyyy")}`}
          </div>
        )}
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
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              record.employee?.name || "Employee"
                            )}`
                          }
                          alt={record.employee?.name || "Employee"}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <span>
                          {record.employee?.name || record.employeeId}
                        </span>
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
                        {getStatusLabel(record.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {attendancePagination && attendancePagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Page {attendancePagination.page} of{" "}
            {attendancePagination.totalPages} • Showing {attendanceList.length}{" "}
            of {attendancePagination.total} records
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={attendancePagination.page <= 1}
              onClick={() => {
                fetchAttendance({
                  page: attendancePagination.page - 1,
                  pageSize: 20,
                  status: statusFilter !== "ALL" ? statusFilter : undefined,
                  date: dateFilter
                    ? format(dateFilter, "yyyy-MM-dd")
                    : undefined,
                });
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                attendancePagination.page >= attendancePagination.totalPages
              }
              onClick={() => {
                fetchAttendance({
                  page: attendancePagination.page + 1,
                  pageSize: 20,
                  status: statusFilter !== "ALL" ? statusFilter : undefined,
                  date: dateFilter
                    ? format(dateFilter, "yyyy-MM-dd")
                    : undefined,
                });
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
