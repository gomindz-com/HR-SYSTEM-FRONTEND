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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Search, Plus, Calendar as CalendarIcon, QrCode } from "lucide-react";

const mockAttendance = [
  {
    id: 1,
    employeeName: "Ebrima Jallow",
    timeIn: "09:00 AM",
    timeOut: "05:30 PM",
    status: "Present",
    date: "2024-06-10",
  },
  {
    id: 2,
    employeeName: "Fatou Camara",
    timeIn: "08:55 AM",
    timeOut: "05:20 PM",
    status: "Present",
    date: "2024-06-10",
  },
  {
    id: 3,
    employeeName: "Lamin Sanyang",
    timeIn: "-",
    timeOut: "-",
    status: "Absent",
    date: "2024-06-10",
  },
  {
    id: 4,
    employeeName: "Awa Ceesay",
    timeIn: "09:10 AM",
    timeOut: "05:40 PM",
    status: "Late",
    date: "2024-06-10",
  },
  {
    id: 5,
    employeeName: "Modou Bah",
    timeIn: "-",
    timeOut: "-",
    status: "On Leave",
    date: "2024-06-10",
  },
  {
    id: 6,
    employeeName: "Isatou Touray",
    timeIn: "09:05 AM",
    timeOut: "05:25 PM",
    status: "Present",
    date: "2024-06-10",
  },
  {
    id: 7,
    employeeName: "Fatoumatta Danso",
    timeIn: "09:00 AM",
    timeOut: "05:30 PM",
    status: "Present",
    date: "2024-06-10",
  },
  {
    id: 8,
    employeeName: "Ndey Samba",
    timeIn: "09:15 AM",
    timeOut: "05:45 PM",
    status: "Late",
    date: "2024-06-10",
  },
];

const AttendancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [attendanceList, setAttendanceList] = useState(mockAttendance);
  const [manualDialogOpen, setManualDialogOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    employeeName: "",
    timeIn: "",
    timeOut: "",
    status: "Present",
    date: new Date().toISOString().slice(0, 10),
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    employeeName: "",
    timeIn: "",
    timeOut: "",
    status: "Present",
    date: new Date().toISOString().slice(0, 10),
  });
  const { toast } = useToast();
  const statusOptions = ["Present", "Absent", "Late", "Half Day"];

  const filteredAttendance = attendanceList.filter((record) =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "bg-success/10 text-success";
      case "Absent":
        return "bg-destructive/10 text-destructive";
      case "Late":
        return "bg-warning/10 text-warning";
      case "Half Day":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const presentCount = attendanceList.filter(
    (a) => a.status === "Present" && a.date === today
  ).length;
  const absentCount = attendanceList.filter(
    (a) => a.status === "Absent" && a.date === today
  ).length;
  const lateCount = attendanceList.filter(
    (a) => a.status === "Late" && a.date === today
  ).length;
  const onLeaveCount = attendanceList.filter(
    (a) => a.status === "On Leave" && a.date === today
  ).length;
  const totalCount = attendanceList.filter((a) => a.date === today).length;
  const attendanceRate =
    totalCount > 0
      ? Math.round(((presentCount + lateCount) / totalCount) * 1000) / 10
      : 0;

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

<a href="/attendance-qr" className="flex items-center gap-4 bg-primary  p-3 rounded-lg text-white hover:bg-primary/90 transition-colors">
  <QrCode className="h-6 w-6" />
  <span>Show QR Code</span>
</a>

      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Present Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {presentCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {onLeaveCount} on leave
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Absent Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {absentCount}
            </div>
            <p className="text-xs text-muted-foreground">{totalCount} total</p>
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
            <p className="text-xs text-muted-foreground">
              {presentCount + lateCount} present/late
            </p>
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
            <p className="text-xs text-muted-foreground">Today</p>
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
          <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                Calendar View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Attendance Calendar</DialogTitle>
              </DialogHeader>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="pointer-events-auto"
              />
            </DialogContent>
          </Dialog>
        </div>
        div
        <Dialog open={manualDialogOpen} onOpenChange={setManualDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Manual Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Manual Attendance Entry</DialogTitle>
            </DialogHeader>
            <form
              className="grid gap-4 py-4"
              onSubmit={(e) => {
                e.preventDefault();
                setAttendanceList((list) => [
                  { ...manualForm, id: Date.now() },
                  ...list,
                ]);
                setManualDialogOpen(false);
                setManualForm({
                  employeeName: "",
                  timeIn: "",
                  timeOut: "",
                  status: "Present",
                  date: new Date().toISOString().slice(0, 10),
                });
                toast({
                  title: "Attendance Added",
                  description: `Attendance for ${manualForm.employeeName} was added!`,
                });
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input
                    id="employeeName"
                    value={manualForm.employeeName}
                    onChange={(e) =>
                      setManualForm((f) => ({
                        ...f,
                        employeeName: e.target.value,
                      }))
                    }
                    placeholder="Full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={manualForm.date}
                    onChange={(e) =>
                      setManualForm((f) => ({ ...f, date: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="timeIn">Time In</Label>
                  <Input
                    id="timeIn"
                    value={manualForm.timeIn}
                    onChange={(e) =>
                      setManualForm((f) => ({ ...f, timeIn: e.target.value }))
                    }
                    placeholder="e.g. 09:00 AM"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timeOut">Time Out</Label>
                  <Input
                    id="timeOut"
                    value={manualForm.timeOut}
                    onChange={(e) =>
                      setManualForm((f) => ({ ...f, timeOut: e.target.value }))
                    }
                    placeholder="e.g. 05:30 PM"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={manualForm.status}
                  onValueChange={(val) =>
                    setManualForm((f) => ({ ...f, status: val }))
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Attendance</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Attendance Table */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Daily Attendance - {selectedDate.toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.employeeName}
                  </TableCell>
                  <TableCell>{record.timeIn}</TableCell>
                  <TableCell>{record.timeOut}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditForm(record);
                        setEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Attendance</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              setAttendanceList((list) =>
                list.map((a) => (a.id === editForm.id ? { ...editForm } : a))
              );
              setEditDialogOpen(false);
              toast({
                title: "Attendance Updated",
                description: `Attendance for ${editForm.employeeName} was updated!`,
              });
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-employeeName">Employee Name</Label>
                <Input
                  id="edit-employeeName"
                  value={editForm.employeeName}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, employeeName: e.target.value }))
                  }
                  placeholder="Full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-timeIn">Time In</Label>
                <Input
                  id="edit-timeIn"
                  value={editForm.timeIn}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, timeIn: e.target.value }))
                  }
                  placeholder="e.g. 09:00 AM"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-timeOut">Time Out</Label>
                <Input
                  id="edit-timeOut"
                  value={editForm.timeOut}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, timeOut: e.target.value }))
                  }
                  placeholder="e.g. 05:30 PM"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(val) =>
                  setEditForm((f) => ({ ...f, status: val }))
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendancePage;
