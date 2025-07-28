import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Calendar,
  QrCode,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building,
  LogOut,
} from "lucide-react";
import { AttendanceQrScanner } from "@/components/QR/AttendanceQrScanner";
import { useAuthStore } from "../../store/useAuthStore";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useAttendanceStore } from "../../store/useAttendanceStore";
import { formatTimeOnly } from "@/lib/utils";

const EmployeePortal = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  const { authUser, checkingAuth } = useAuthStore();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [leaveRequestOpen, setLeaveRequestOpen] = useState(false);

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInOpen(false);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckOutOpen(false);
  };

  const handleLeaveRequest = () => {
    setLeaveRequestOpen(false);
    // Handle leave request submission
  };

  // Mock attendance data
  // Mock leave requests data
  const leaveRequestsData = [
    {
      id: "001",
      type: "Annual Leave",
      startDate: "2024-02-15",
      endDate: "2024-02-20",
      days: 6,
      status: "Approved",
      reason: "Family vacation",
    },
    {
      id: "002",
      type: "Sick Leave",
      startDate: "2024-01-28",
      endDate: "2024-01-28",
      days: 1,
      status: "Pending",
      reason: "Medical appointment",
    },
    {
      id: "003",
      type: "Personal Leave",
      startDate: "2024-01-20",
      endDate: "2024-01-21",
      days: 2,
      status: "Rejected",
      reason: "Personal matters",
    },
    {
      id: "004",
      type: "Maternity Leave",
      startDate: "2024-03-01",
      endDate: "2024-05-01",
      days: 60,
      status: "Approved",
      reason: "Maternity leave",
    },
    {
      id: "005",
      type: "Annual Leave",
      startDate: "2024-12-25",
      endDate: "2024-12-31",
      days: 7,
      status: "Pending",
      reason: "Christmas holidays",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ON_TIME":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="w-3 h-3 mr-1" />
            On Time
          </Badge>
        );
      case "LATE":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <AlertCircle className="w-3 h-3 mr-1" />
            Late
          </Badge>
        );
      case "ABSENT":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      case "Approved":
        return (
          <Badge className="bg-success text-success-foreground">Approved</Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-warning text-warning-foreground">Pending</Badge>
        );
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const { logout, loggingOut } = useAuthStore();
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      const success = await logout();
      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.log("Logout failed:", error);
    }
  }

  const {
    fetchMyAttendance,
    fetchingMine,
    pagination,
    myAttendaneList,
    getAttendanceStats,
    gettingStats,
    attendanceStats,
  } = useAttendanceStore();

  useEffect(() => {
    fetchMyAttendance();
    getAttendanceStats();
  }, [fetchMyAttendance, getAttendanceStats]);

  // Show loading state while auth is being checked
  if (checkingAuth || !authUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading employee portal...</p>
        </div>
      </div>
    );
  }

  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      fetchMyAttendance({ page: nextPage, limit: pagination.limit });
    }
  };
  const handlePreviousPage = () => {
    if (pagination.page > 1) {
      const previousPage = pagination.page - 1;
      fetchMyAttendance({ page: previousPage, limit: pagination.limit });
    }
  };
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Show loading for attendance data */}
      {fetchingMine && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              Loading attendance data...
            </p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={authUser?.profilePic} alt="Profile Picture" />
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {authUser?.role === "HR" ? "HR Portal" : "Employee Portal"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {authUser?.name} • {authUser?.position} • company:{" "}
                {authUser?.company?.companyName || "Unknown Company"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Time</p>
                <p className="text-xl font-semibold text-foreground">
                  {currentTime}
                </p>
              </div>
              <div className="flex space-x-2">
                {/* Check In Dialog */}
                <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={isCheckedIn}
                      className="bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Check In
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <AttendanceQrScanner
                      key={checkInOpen ? "check-in-open" : "check-in-closed"}
                      mode="check-in"
                      onSuccess={handleCheckIn}
                    />
                  </DialogContent>
                </Dialog>

                {/* Check Out Dialog */}
                <Dialog open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={!isCheckedIn} variant="destructive">
                      <Clock className="mr-2 h-4 w-4" />
                      Check Out
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <AttendanceQrScanner
                      key={checkOutOpen ? "check-out-open" : "check-out-closed"}
                      mode="check-out"
                      onSuccess={handleCheckOut}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <Card className="mb-6 shadow-[var(--shadow-soft)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      authUser.status === "ACTIVE"
                        ? "bg-success"
                        : authUser.status === "ON_LEAVE"
                        ? "bg-warning"
                        : "bg-destructive"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    Status:{" "}
                    {authUser.status === "ACTIVE"
                      ? "Active"
                      : authUser.status === "ON_LEAVE"
                      ? "On Leave"
                      : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Department:{" "}
                    {authUser.department?.name || "Unknown Department"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Today: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-3 border-l border-border">
                {/* HR Dashboard Button - Only visible to HR */}
                {authUser?.role === "HR" && (
                  <Button
                    variant="outline"
                    className="flex items-center justify-center"
                    onClick={() => navigate("/dashboard")}
                  >
                    <Building className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="flex items-center justify-center"
                  onClick={handleLogout}
                >
                  Logout
                  <LogOut className="w-4 h-4 font-extrabold text-primary" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Table */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Attendance History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>

                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fetchingMine ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                            <span className="text-muted-foreground">
                              Loading attendance data...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : myAttendaneList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <span className="text-muted-foreground">
                            No attendance records found
                          </span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      myAttendaneList.map((record, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={record.employee.profilePic} />
                              </Avatar>
                              <div className="flex flex-col gap-1">
                                <span className="truncate">
                                  {record.employee.name}
                                </span>
                                <span className="truncate text-muted-foreground">
                                  {record.employee.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="font-medium truncate">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="truncate">
                            {formatTimeOnly(record.timeIn)}
                          </TableCell>
                          <TableCell className="truncate">
                            {formatTimeOnly(record.timeOut)}
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <div
                  className={`${
                    myAttendaneList.length < 10 ? "hidden" : ""
                  } flex items-center justify-end p-4 gap-4`}
                >
                  <button
                    onClick={handlePreviousPage}
                    className={`border rounded-md p-1 cursor-pointer ${
                      pagination.page === 1
                        ? "bg-gray-200 text-gray-500"
                        : "bg-white text-black"
                    }`}
                    disabled={pagination.page === 1}
                  >
                    prev
                  </button>
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    className={`border rounded-md p-1 cursor-pointer ${
                      pagination.page === pagination.totalPages
                        ? "bg-gray-200 text-gray-500"
                        : "bg-white text-black"
                    }`}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    next
                  </button>
                </div>{" "}
              </div>

              {/* Summary Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <p className="text-lg font-bold text-success">
                    {attendanceStats.attendancePercentage}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Attendance Rate
                  </p>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <p className="text-lg font-bold text-primary">
                    {attendanceStats.daysAbsent}
                  </p>
                  <p className="text-xs text-muted-foreground">Days Absent</p>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <p className="text-lg font-bold text-warning">
                    {attendanceStats.daysLate}
                  </p>
                  <p className="text-xs text-muted-foreground">Late Days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Requests Table */}
          <Card className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Leave Requests
                </CardTitle>

                {/* Request Leave Dialog */}
                <Dialog
                  open={leaveRequestOpen}
                  onOpenChange={setLeaveRequestOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Request Leave
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Request Leave</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="leave-type">Leave Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="annual">Annual Leave</SelectItem>
                            <SelectItem value="sick">Sick Leave</SelectItem>
                            <SelectItem value="personal">
                              Personal Leave
                            </SelectItem>
                            <SelectItem value="maternity">
                              Maternity Leave
                            </SelectItem>
                            <SelectItem value="paternity">
                              Paternity Leave
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input type="date" id="start-date" />
                        </div>
                        <div>
                          <Label htmlFor="end-date">End Date</Label>
                          <Input type="date" id="end-date" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="reason">Reason</Label>
                        <Textarea
                          id="reason"
                          placeholder="Please provide a reason for your leave request..."
                          rows={3}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setLeaveRequestOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleLeaveRequest} className="flex-1">
                          Submit Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequestsData.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {request.type}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {new Date(request.startDate).toLocaleDateString()}
                            </div>
                            {request.startDate !== request.endDate && (
                              <div className="text-muted-foreground">
                                to{" "}
                                {new Date(request.endDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{request.days}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Leave Balance */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <p className="text-lg font-bold text-primary">18</p>
                  <p className="text-xs text-muted-foreground">
                    Days Available
                  </p>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <p className="text-lg font-bold text-warning">7</p>
                  <p className="text-xs text-muted-foreground">Days Used</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-lg font-bold text-muted-foreground">2</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;
