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
  Menu,
} from "lucide-react";
import { AttendanceQrScanner } from "@/components/QR/AttendanceQrScanner";
import { useAuthStore } from "../../store/useAuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
          <Badge className="bg-green-100 text-green-800 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            On Time
          </Badge>
        );
      case "LATE":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            Late
          </Badge>
        );
      case "ABSENT":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Absent
          </Badge>
        );
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 text-xs">
            Approved
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
            Pending
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  const { logout, loggingOut } = useAuthStore();
  const navigate = useNavigate();

  const handleUpdateProfile = () => {
    navigate("/user-profile");
  };
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
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
        {/* Header - Super Responsive */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          {/* Top Row - Avatar, Name, and Update Button */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex-shrink-0">
                <AvatarImage
                  src={authUser?.profilePic}
                  alt="Profile Picture"
                  className="object-cover"
                />
                <AvatarFallback className="bg-purple-100 text-purple-600 text-sm sm:text-base font-semibold">
                  {authUser?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground truncate">
                  {authUser?.role === "HR" ? "HR Portal" : "Employee Portal"}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                  {authUser?.name} • {authUser?.position}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {authUser?.company?.companyName || "Unknown Company"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0"
              onClick={handleUpdateProfile}
            >
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Update Profile</span>
              <span className="sm:hidden">Update</span>
            </Button>
          </div>

          {/* Second Row - Time Display */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="text-center bg-muted/50 rounded-lg px-3 py-2 sm:px-4 sm:py-3">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                Current Time
              </p>
              <p className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
                {currentTime}
              </p>
            </div>
          </div>

          {/* Third Row - Check In/Out Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Check In Dialog */}
            <Dialog open={checkInOpen} onOpenChange={setCheckInOpen}>
              <DialogTrigger asChild>
                <Button
                  disabled={isCheckedIn}
                  className="bg-green-600 hover:bg-green-700 text-white h-10 sm:h-11 text-sm sm:text-base font-medium"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Check In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw]">
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
                <Button
                  variant="destructive"
                  className="h-10 sm:h-11 text-sm sm:text-base font-medium"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Check Out
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw]">
                <AttendanceQrScanner
                  key={checkOutOpen ? "check-out-open" : "check-out-closed"}
                  mode="check-out"
                  onSuccess={handleCheckOut}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Status Bar - Mobile Responsive */}
        <Card className="mb-4 sm:mb-6 shadow-[var(--shadow-soft)]">
          <CardContent className="pt-3 sm:pt-4 md:pt-6">
            <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
              <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:space-x-4 lg:space-x-6">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      authUser.status === "ACTIVE"
                        ? "bg-success"
                        : authUser.status === "ON_LEAVE"
                        ? "bg-warning"
                        : "bg-destructive"
                    }`}
                  ></div>
                  <span className="text-xs sm:text-sm font-medium">
                    Status:{" "}
                    {authUser.status === "ACTIVE"
                      ? "Active"
                      : authUser.status === "ON_LEAVE"
                      ? "On Leave"
                      : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm">
                    {authUser.department?.name || "Unknown Department"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="text-xs sm:text-sm">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-0 sm:border-l sm:border-border sm:pl-3">
                {/* HR Dashboard Button - Only visible to HR */}
                {authUser?.role === "HR" && (
                  <Button
                    variant="outline"
                    className="flex items-center justify-center text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                    onClick={() => navigate("/dashboard")}
                    size="sm"
                  >
                    <Building className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">HR</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="flex items-center justify-center text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                  onClick={handleLogout}
                  size="sm"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Attendance Table */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-3 sm:pb-4 md:pb-6">
              <CardTitle className="flex items-center text-base sm:text-lg md:text-xl">
                <Clock className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Attendance History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-4 md:p-6">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                        Employee
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                        Date
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                        Check In
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                        Check Out
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fetchingMine ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                            <span className="text-muted-foreground text-sm">
                              Loading attendance data...
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : myAttendaneList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <span className="text-muted-foreground text-sm">
                            No attendance records found
                          </span>
                        </TableCell>
                      </TableRow>
                    ) : (
                      myAttendaneList.map((record, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                          <TableCell className="py-2 sm:py-3 px-2 sm:px-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                                <AvatarImage src={record.employee.profilePic} />
                              </Avatar>
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className="truncate text-xs sm:text-sm font-medium">
                                  {record.employee.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                  {record.employee.email}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium truncate text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="truncate text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4">
                            {formatTimeOnly(record.timeIn)}
                          </TableCell>
                          <TableCell className="truncate text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4">
                            {record.timeOut !== null
                              ? formatTimeOnly(record.timeOut)
                              : "-"}
                          </TableCell>
                          <TableCell className="py-2 sm:py-3 px-2 sm:px-4">
                            {getStatusBadge(record.status)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <div
                  className={`${
                    myAttendaneList.length < 10 ? "hidden" : ""
                  } flex items-center justify-end p-3 sm:p-4 gap-2 sm:gap-4`}
                >
                  <button
                    onClick={handlePreviousPage}
                    className={`border rounded-md p-1 sm:p-2 cursor-pointer text-xs sm:text-sm ${
                      pagination.page === 1
                        ? "bg-gray-200 text-gray-500"
                        : "bg-white text-black"
                    }`}
                    disabled={pagination.page === 1}
                  >
                    prev
                  </button>
                  <span className="text-xs sm:text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    className={`border rounded-md p-1 sm:p-2 cursor-pointer text-xs sm:text-sm ${
                      pagination.page === pagination.totalPages
                        ? "bg-gray-200 text-gray-500"
                        : "bg-white text-black"
                    }`}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    next
                  </button>
                </div>
              </div>

              {/* Summary Stats - Mobile Responsive */}
              <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm sm:text-lg font-bold text-blue-600">
                    {attendanceStats.attendancePercentage}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Attendance Rate
                  </p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-100 rounded-lg">
                  <p className="text-sm sm:text-lg font-bold text-green-600">
                    {attendanceStats.daysOnTime}
                  </p>
                  <p className="text-xs text-muted-foreground">On Time</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-red-100 rounded-lg">
                  <p className="text-sm sm:text-lg font-bold text-red-600">
                    {attendanceStats.daysAbsent}
                  </p>
                  <p className="text-xs text-muted-foreground">Days Absent</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-yellow-100 rounded-lg">
                  <p className="text-sm sm:text-lg font-bold text-yellow-600">
                    {attendanceStats.daysLate}
                  </p>
                  <p className="text-xs text-muted-foreground">Late Days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Requests Table */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-3 sm:pb-4 md:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <CardTitle className="flex items-center text-base sm:text-lg md:text-xl">
                  <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Leave Requests
                </CardTitle>

                {/* Request Leave Dialog */}
                <Dialog
                  open={leaveRequestOpen}
                  onOpenChange={setLeaveRequestOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      disabled={true}
                      size="sm"
                      className="w-full sm:w-auto h-9 sm:h-10"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Request Leave
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw]">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
            <CardContent className="p-0 sm:p-4 md:p-6">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                        Type
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                        Dates
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                        Days
                      </TableHead>
                      <TableHead className="text-xs sm:text-sm px-2 sm:px-4">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequestsData.map((request) => (
                      <TableRow key={request.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4">
                          {request.type}
                        </TableCell>
                        <TableCell className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="text-xs sm:text-sm">
                            <div>
                              {new Date(request.startDate).toLocaleDateString()}
                            </div>
                            {request.startDate !== request.endDate && (
                              <div className="text-muted-foreground text-xs">
                                to{" "}
                                {new Date(request.endDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4">
                          {request.days}
                        </TableCell>
                        <TableCell className="py-2 sm:py-3 px-2 sm:px-4">
                          {getStatusBadge(request.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Leave Balance - Mobile Responsive */}
              <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm sm:text-lg font-bold text-blue-600">
                    18
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Days Available
                  </p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-yellow-100 rounded-lg">
                  <p className="text-sm sm:text-lg font-bold text-yellow-600">
                    7
                  </p>
                  <p className="text-xs text-muted-foreground">Days Used</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm sm:text-lg font-bold text-gray-600">
                    2
                  </p>
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
