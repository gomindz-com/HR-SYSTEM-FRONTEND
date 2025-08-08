import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  Search,
  Check,
  X,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import { useLeaveStore } from "@/store/useLeaveStore";
import { LeaveStatus } from "@/store/useLeaveStore";

const LeavePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [selectedComment, setSelectedComment] = useState<{
    text: string;
    employeeName: string;
    leaveType: string;
  } | null>(null);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequestForRejection, setSelectedRequestForRejection] =
    useState<{
      id: number;
      employeeName: string;
      leaveType: string;
    } | null>(null);

  const {
    requests,
    allRequestsPagination,
    gettingLeaveRequests,
    approveLeave,
    rejectLeave,
    approvingLeave,
    rejectingLeave,
    getLeaveRequests,
    stats,
    getLeaveStats,
    gettingStats,
  } = useLeaveStore();

  // Load data on component mount and handle filter changes
  useEffect(() => {
    getLeaveRequests({
      search: searchTerm,
      status: statusFilter,
      leaveType: leaveTypeFilter,
    });
  }, [searchTerm, statusFilter, leaveTypeFilter]);

  // Load stats on component mount only
  useEffect(() => {
    getLeaveStats();
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

  const handleApprove = async (id: number) => {
    await approveLeave(id.toString());
  };

  const handleRejectClick = (
    id: number,
    employeeName: string,
    leaveType: string
  ) => {
    setSelectedRequestForRejection({ id, employeeName, leaveType });
    setRejectReason("");
    setIsRejectDialogOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!selectedRequestForRejection || !rejectReason.trim()) {
      return;
    }

    await rejectLeave(
      selectedRequestForRejection.id.toString(),
      rejectReason.trim()
    );
    setIsRejectDialogOpen(false);
    setSelectedRequestForRejection(null);
    setRejectReason("");
  };

  const handleCommentClick = (
    comment: string,
    employeeName: string,
    leaveType: string
  ) => {
    if (comment && comment.length > 50) {
      setSelectedComment({ text: comment, employeeName, leaveType });
      setIsCommentDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
        <p className="text-muted-foreground">
          Handle leave requests and time-off approvals
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {gettingStats ? "..." : stats.pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {gettingStats ? "..." : stats.approvedCount}
            </div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {gettingStats ? "..." : stats.rejectedCount}
            </div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {gettingStats ? "..." : stats.totalDays}
            </div>
            <p className="text-xs text-muted-foreground">Total leave taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by employee name..."
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={leaveTypeFilter} onValueChange={setLeaveTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vacation">Vacation</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="maternity">Maternity</SelectItem>
              <SelectItem value="study">Study</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Leave Requests
            {gettingLeaveRequests && (
              <span className="text-sm text-muted-foreground">
                (Loading...)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {gettingLeaveRequests
                      ? "Loading leave requests..."
                      : "No leave requests found"}
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.employee.name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {request.leaveType.toLowerCase().replace("_", " ")}
                    </TableCell>
                    <TableCell>
                      {new Date(request.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(request.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell className="max-w-48">
                      <div className="flex items-center gap-2">
                        <span className="truncate">
                          {request.comments || "No comments"}
                        </span>
                        {request.comments && request.comments.length > 50 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              handleCommentClick(
                                request.comments!,
                                request.employee.name,
                                request.leaveType
                              )
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === LeaveStatus.PENDING && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-success hover:text-success hover:bg-success/10"
                            onClick={() => handleApprove(request.id)}
                            disabled={approvingLeave}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              handleRejectClick(
                                request.id,
                                request.employee.name,
                                request.leaveType
                              )
                            }
                            disabled={rejectingLeave}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination Info */}
      {allRequestsPagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            {(allRequestsPagination.page - 1) * allRequestsPagination.pageSize +
              1}{" "}
            to{" "}
            {Math.min(
              allRequestsPagination.page * allRequestsPagination.pageSize,
              allRequestsPagination.total
            )}{" "}
            of {allRequestsPagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                getLeaveRequests({
                  page: allRequestsPagination.page - 1,
                  search: searchTerm,
                  status: statusFilter,
                  leaveType: leaveTypeFilter,
                })
              }
              disabled={allRequestsPagination.page <= 1 || gettingLeaveRequests}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: allRequestsPagination.totalPages },
                (_, i) => i + 1
              )
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current
                  const current = allRequestsPagination.page;
                  const total = allRequestsPagination.totalPages;
                  return (
                    page === 1 ||
                    page === total ||
                    (page >= current - 1 && page <= current + 1)
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore =
                    index > 0 && page - array[index - 1] > 1;

                  return (
                    <div key={page} className="flex items-center">
                      {showEllipsisBefore && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={
                          page === allRequestsPagination.page
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() =>
                          getLeaveRequests({
                            page,
                            search: searchTerm,
                            status: statusFilter,
                            leaveType: leaveTypeFilter,
                          })
                        }
                        disabled={gettingLeaveRequests}
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                getLeaveRequests({
                  page: allRequestsPagination.page + 1,
                  search: searchTerm,
                  status: statusFilter,
                  leaveType: leaveTypeFilter,
                })
              }
              disabled={
                allRequestsPagination.page >=
                  allRequestsPagination.totalPages || gettingLeaveRequests
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Leave Request Details
            </DialogTitle>
            <DialogDescription>
              Employee:{" "}
              <span className="font-semibold">
                {selectedComment?.employeeName}
              </span>{" "}
              | Leave Type:{" "}
              <span className="font-semibold capitalize">
                {selectedComment?.leaveType?.toLowerCase().replace("_", " ")}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Comments
              </h4>
              <div className="bg-muted/50 rounded-lg p-4 border">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedComment?.text || "No comments provided"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Reject Leave Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this leave request? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 border">
              <p className="text-sm">
                <span className="font-medium">Employee:</span>{" "}
                {selectedRequestForRejection?.employeeName}
              </p>
              <p className="text-sm">
                <span className="font-medium">Leave Type:</span>{" "}
                <span className="capitalize">
                  {selectedRequestForRejection?.leaveType
                    ?.toLowerCase()
                    .replace("_", " ")}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reject-reason" className="text-sm font-medium">
                Rejection Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reject-reason"
                placeholder="Please provide a reason for rejecting this leave request..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px] resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                This reason will be sent to the employee via email notification.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setSelectedRequestForRejection(null);
                setRejectReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={!rejectReason.trim() || rejectingLeave}
            >
              {rejectingLeave ? "Rejecting..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeavePage;
