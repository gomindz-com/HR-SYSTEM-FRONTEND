import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Search, Plus, Check, X } from "lucide-react";

const mockLeaveRequests = [
  {
    id: 1,
    employeeName: "Ebrima Jallow",
    leaveType: "Vacation",
    startDate: "2024-06-20",
    endDate: "2024-06-25",
    days: 5,
    reason: "Family trip to Basse",
    status: "Pending",
    appliedDate: "2024-06-10",
  },
  {
    id: 2,
    employeeName: "Fatou Camara",
    leaveType: "Sick Leave",
    startDate: "2024-06-12",
    endDate: "2024-06-14",
    days: 3,
    reason: "Medical checkup",
    status: "Approved",
    appliedDate: "2024-06-09",
  },
  {
    id: 3,
    employeeName: "Lamin Sanyang",
    leaveType: "Personal",
    startDate: "2024-06-18",
    endDate: "2024-06-18",
    days: 1,
    reason: "Personal matters",
    status: "Rejected",
    appliedDate: "2024-06-08",
  },
  {
    id: 4,
    employeeName: "Awa Ceesay",
    leaveType: "Maternity",
    startDate: "2024-07-01",
    endDate: "2024-10-01",
    days: 93,
    reason: "Maternity leave",
    status: "Pending",
    appliedDate: "2024-06-01",
  },
  {
    id: 5,
    employeeName: "Modou Bah",
    leaveType: "Annual",
    startDate: "2024-06-15",
    endDate: "2024-06-30",
    days: 16,
    reason: "Annual leave",
    status: "Approved",
    appliedDate: "2024-06-05",
  },
  {
    id: 6,
    employeeName: "Isatou Touray",
    leaveType: "Sick Leave",
    startDate: "2024-06-11",
    endDate: "2024-06-13",
    days: 3,
    reason: "Flu recovery",
    status: "Pending",
    appliedDate: "2024-06-10",
  },
  {
    id: 7,
    employeeName: "Fatoumatta Danso",
    leaveType: "Conference",
    startDate: "2024-06-22",
    endDate: "2024-06-24",
    days: 3,
    reason: "AI Conference in Dakar",
    status: "Pending",
    appliedDate: "2024-06-10",
  },
  {
    id: 8,
    employeeName: "Ndey Samba",
    leaveType: "Business Trip",
    startDate: "2024-06-16",
    endDate: "2024-06-18",
    days: 3,
    reason: "BD meetings in Senegal",
    status: "Approved",
    appliedDate: "2024-06-09",
  },
];

const LeavePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requests, setRequests] = useState(mockLeaveRequests);

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success/10 text-success";
      case "Rejected":
        return "bg-destructive/10 text-destructive";
      case "Pending":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const handleApprove = (id: number) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Approved" } : req))
    );
  };

  const handleReject = (id: number) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "Rejected" } : req))
    );
  };

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;
  const totalDays = requests.reduce((sum, r) => sum + r.days, 0);

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
              {pendingCount}
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
              {approvedCount}
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
              {rejectedCount}
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
            <div className="text-2xl font-bold text-primary">{totalDays}</div>
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
              placeholder="Search requests..."
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
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      {/* Leave Requests Table */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Leave Requests
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
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.employeeName}
                  </TableCell>
                  <TableCell>{request.leaveType}</TableCell>
                  <TableCell>
                    {new Date(request.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(request.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.days}</TableCell>
                  <TableCell className="max-w-48 truncate">
                    {request.reason}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.status === "Pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-success hover:text-success hover:bg-success/10"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeavePage;
