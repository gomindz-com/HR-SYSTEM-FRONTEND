import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Calendar, Plus, AlertTriangle, X } from "lucide-react";
import { useLeaveStore, LeaveStatus, LeaveType } from "@/store/useLeaveStore";
import { Separator } from "../ui/separator";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EmployeeLeaveSection = () => {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

  // Form state
  const [leaveType, setLeaveType] = useState<LeaveType | "">("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [comments, setComments] = useState("");
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);

  const {
    myRequests,
    myRequestsPagination,
    gettingMyLeaveRequests,
    requestLeave,
    requestingLeave,
    getMyLeaveRequests,
    leaveBalance,
    getLeaveBalance,
    gettingLeaveBalance,
  } = useLeaveStore();

  // Load data on component mount
  useEffect(() => {
    getMyLeaveRequests();
    getLeaveBalance();
  }, []);

  const getStatusColor = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return "bg-success/10 text-success";
      case LeaveStatus.REJECTED:
        return "bg-destructive/10 text-destructive";
      case LeaveStatus.PENDING:
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const handleSubmitRequest = async () => {
    if (!leaveType || !startDate || !endDate) {
      return;
    }

    await requestLeave({
      leaveType,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      comments,
      attachmentUrls: attachmentFiles,
    });

    // Reset form
    setLeaveType("");
    setStartDate(undefined);
    setEndDate(undefined);
    setComments("");
    setAttachmentFiles([]);
    setIsRequestDialogOpen(false);

    // Refresh data
    getMyLeaveRequests();
    getLeaveBalance();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachmentFiles(Array.from(e.target.files));
    }
  };

  const handleFileUploadClick = () => {
    document.getElementById("attachments")?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-400", "bg-blue-50");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");

    if (e.dataTransfer.files) {
      setAttachmentFiles(Array.from(e.dataTransfer.files));
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3 sm:pb-4 md:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <CardTitle className="flex items-center text-base sm:text-lg md:text-xl ">
            <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Leave Requests
          </CardTitle>

          {/* Request Leave Dialog */}
          {isRequestDialogOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setIsRequestDialogOpen(false)}
            >
              <div
                className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h2 className="text-base sm:text-lg font-semibold">
                      Leave Request
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRequestDialogOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                <div className="p-4">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Submit a new leave request for approval
                  </p>
                </div>

                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    {/* Left Section - Form Inputs */}
                    <div className="space-y-2 sm:space-y-3">
                      {/* Leave Type */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="leave-type"
                          className="text-xs sm:text-sm font-medium"
                        >
                          Leave Type <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={leaveType}
                          onValueChange={(value) =>
                            setLeaveType(value as LeaveType)
                          }
                        >
                          <SelectTrigger className="h-8 sm:h-9 text-xs sm:text-sm">
                            <SelectValue placeholder="Select leave type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={LeaveType.ANNUAL}>
                              Annual Leave
                            </SelectItem>
                            <SelectItem value={LeaveType.SICK}>
                              Sick Leave
                            </SelectItem>
                            <SelectItem value={LeaveType.PERSONAL}>
                              Personal Leave
                            </SelectItem>
                            <SelectItem value={LeaveType.MATERNITY}>
                              Maternity Leave
                            </SelectItem>
                            <SelectItem value={LeaveType.STUDY}>
                              Study Leave
                            </SelectItem>
                            <SelectItem value={LeaveType.VACATION}>
                              Vacation
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Date Range */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="dates"
                          className="text-xs sm:text-sm font-medium"
                        >
                          Dates <span className="text-destructive">*</span>
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-8 sm:h-9 text-xs sm:text-sm",
                                  !startDate && "text-muted-foreground"
                                )}
                              >
                                {startDate ? (
                                  format(startDate, "PPP")
                                ) : (
                                  <span>Pick a start date</span>
                                )}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "h-8 sm:h-9 text-xs sm:text-sm",
                                  !endDate && "text-muted-foreground"
                                )}
                              >
                                {endDate ? (
                                  format(endDate, "PPP")
                                ) : (
                                  <span>Pick an end date</span>
                                )}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Comments */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="comments"
                          className="text-xs sm:text-sm font-medium"
                        >
                          About
                        </Label>
                        <Textarea
                          id="comments"
                          placeholder="Include comments for your approver"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          rows={2}
                          className="resize-none text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Right Section - File Attachments */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="space-y-1">
                        <Label
                          htmlFor="attachments"
                          className="text-xs sm:text-sm font-medium"
                        >
                          Attachments
                        </Label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-3 text-center hover:border-gray-400 transition-colors cursor-pointer min-h-[120px] sm:min-h-[140px] flex items-center justify-center"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={handleFileUploadClick}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg
                                className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-700">
                                Upload a file or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, PDF up to 10MB
                              </p>
                            </div>
                          </div>
                          <Input
                            type="file"
                            id="attachments"
                            multiple
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="hidden"
                          />
                        </div>
                        {attachmentFiles.length > 0 && (
                          <div className="space-y-1">
                            {attachmentFiles.map((file, index) => (
                              <div
                                key={index}
                                className="text-xs text-gray-600 flex items-center gap-1"
                              >
                                <span>📎</span>
                                <span className="truncate">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 justify-end p-4 border-t bg-gray-50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsRequestDialogOpen(false);
                      setLeaveType("");
                      setStartDate(undefined);
                      setEndDate(undefined);
                      setComments("");
                      setAttachmentFiles([]);
                    }}
                    className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitRequest}
                    disabled={
                      !leaveType || !startDate || !endDate || requestingLeave
                    }
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    {requestingLeave ? "Submitting..." : "Request Now"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Button
            size="sm"
            className="w-full sm:w-auto h-9 sm:h-10"
            onClick={() => setIsRequestDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Request Leave
          </Button>
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
              {gettingMyLeaveRequests ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                      <span className="text-muted-foreground text-sm">
                        Loading leave requests...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : myRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="text-center">
                      <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <span className="text-muted-foreground text-sm">
                        No leave requests found
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click "Request Leave" to submit your first request
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                myRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4">
                      <span className="capitalize">
                        {request.leaveType.toLowerCase().replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="text-xs sm:text-sm">
                        <div>
                          {new Date(request.startDate).toLocaleDateString()}
                        </div>
                        {request.startDate !== request.endDate && (
                          <div className="text-muted-foreground text-xs">
                            to {new Date(request.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4">
                      {request.days}
                    </TableCell>
                    <TableCell className="py-2 sm:py-3 px-2 sm:px-4">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {myRequestsPagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 sm:mt-6">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              {(myRequestsPagination.page - 1) * myRequestsPagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                myRequestsPagination.page * myRequestsPagination.pageSize,
                myRequestsPagination.total
              )}{" "}
              of {myRequestsPagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  getMyLeaveRequests({
                    page: myRequestsPagination.page - 1,
                  })
                }
                disabled={
                  myRequestsPagination.page <= 1 || gettingMyLeaveRequests
                }
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {myRequestsPagination.page} of{" "}
                {myRequestsPagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  getMyLeaveRequests({
                    page: myRequestsPagination.page + 1,
                  })
                }
                disabled={
                  myRequestsPagination.page >=
                    myRequestsPagination.totalPages || gettingMyLeaveRequests
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Leave Balance - Mobile Responsive */}
        <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center p-2 sm:p-3 bg-blue-100 rounded-lg">
            <p className="text-sm sm:text-lg font-bold text-blue-600">
              {gettingLeaveBalance ? "..." : leaveBalance.daysLeft}
            </p>
            <p className="text-xs text-muted-foreground">Rejected Requests</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-yellow-100 rounded-lg">
            <p className="text-sm sm:text-lg font-bold text-yellow-600">
              {gettingLeaveBalance ? "..." : leaveBalance.daysUsed}
            </p>
            <p className="text-xs text-muted-foreground">Approved Requests</p>
          </div>
          <div className="text-center p-2 sm:p-3 bg-gray-100 rounded-lg">
            <p className="text-sm sm:text-lg font-bold text-gray-600">
              {gettingLeaveBalance ? "..." : leaveBalance.pendingRequests}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeLeaveSection;
