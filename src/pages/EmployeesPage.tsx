import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Mock employee data
const employees = [
  {
    id: 1,
    name: "Ebrima Jallow",
    email: "ebrima.jallow@gomindz.gm",
    phone: "+220 3456789",
    position: "Software Engineer",
    department: "Engineering",
    location: "Banjul, Gambia",
    startDate: "2021-03-15",
    status: "Active",
    avatar: "EJ",
  },
  {
    id: 2,
    name: "Fatou Camara",
    email: "fatou.camara@gomindz.gm",
    phone: "+220 2345678",
    position: "Product Manager",
    department: "Product",
    location: "Serrekunda, Gambia",
    startDate: "2020-11-01",
    status: "Active",
    avatar: "FC",
  },
  {
    id: 3,
    name: "Lamin Sanyang",
    email: "lamin.sanyang@gomindz.gm",
    phone: "+220 1234567",
    position: "UX Designer",
    department: "Design",
    location: "Bakau, Gambia",
    startDate: "2022-07-10",
    status: "Active",
    avatar: "LS",
  },
  {
    id: 4,
    name: "Awa Ceesay",
    email: "awa.ceesay@gomindz.gm",
    phone: "+220 9876543",
    position: "HR Specialist",
    department: "Human Resources",
    location: "Brikama, Gambia",
    startDate: "2023-01-20",
    status: "Active",
    avatar: "AC",
  },
  {
    id: 5,
    name: "Modou Bah",
    email: "modou.bah@gomindz.gm",
    phone: "+220 8765432",
    position: "Sales Manager",
    department: "Sales",
    location: "Banjul, Gambia",
    startDate: "2019-09-05",
    status: "On Leave",
    avatar: "MB",
  },
  {
    id: 6,
    name: "Isatou Touray",
    email: "isatou.touray@gomindz.gm",
    phone: "+220 7654321",
    position: "Marketing Coordinator",
    department: "Marketing",
    location: "Kanifing, Gambia",
    startDate: "2022-12-12",
    status: "Active",
    avatar: "IT",
  },
  // New employees
  {
    id: 7,
    name: "Fatoumatta Danso",
    email: "fatoumatta.danso@gomindz.gm",
    phone: "+220 6543210",
    position: "AI Lead",
    department: "Engineering",
    location: "Bakau, Gambia",
    startDate: "2024-02-01",
    status: "Active",
    avatar: "FD",
  },
  {
    id: 8,
    name: "Ndey Samba",
    email: "ndey.samba@gomindz.gm",
    phone: "+220 5432109",
    position: "Business Development Lead",
    department: "Sales",
    location: "Serrekunda, Gambia",
    startDate: "2023-11-15",
    status: "Active",
    avatar: "NS",
  },
];

const departments = [
  "All Departments",
  "Engineering",
  "Product",
  "Design",
  "Sales",
  "Human Resources",
  "Marketing",
];
const statuses = ["All Statuses", "Active", "On Leave", "Inactive"];

const inviteFormSchema = z.object({
  email: z.string().email(),
  role: z.enum(["EMPLOYEE", "DIRECTOR", "HR"]),
  position: z.string().min(1, "Position is required"),
});

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { sendInvitation, sendingInvitation } = useAuthStore();
  const inviteForm = useForm<z.infer<typeof inviteFormSchema>>({
    defaultValues: {
      email: "",
      role: "EMPLOYEE",
      position: "",
    },
    resolver: zodResolver(inviteFormSchema),
  });
  const [employeesList, setEmployeesList] = useState(employees);
  const { toast } = useToast();

  const filteredEmployees = employeesList.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      employee.department === selectedDepartment;

    const matchesStatus =
      selectedStatus === "All Statuses" || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "secondary";
      case "On Leave":
        return "outline";
      case "Inactive":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Employee Directory
          </h1>
          <p className="text-muted-foreground">
            Manage and view all employees in your organization
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4 mr-2" />
              Invite Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Invite Employee</DialogTitle>
            </DialogHeader>
            <Form {...inviteForm}>
              <form
                className="grid gap-4 py-4"
                onSubmit={inviteForm.handleSubmit(async (data) => {
                  try {
                    const success = await sendInvitation({
                      email: data.email,
                      role: data.role,
                      position: data.position,
                    });
                    if(success){
                    setDialogOpen(false);
                    inviteForm.reset();
                    
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to send invitation.",
                      variant: "destructive",
                    });
                  }
                })}
              >
                <FormField
                  control={inviteForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={inviteForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EMPLOYEE">Employee</SelectItem>
                            <SelectItem value="DIRECTOR">Director</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={inviteForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={sendingInvitation}>
                    {sendingInvitation ? "Sending..." : "Send Invitation"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search employees by name, email, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-3">
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEmployees.length} of {employeesList.length}{" "}
              employees
            </p>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card
            key={employee.id}
            className="shadow-card hover:shadow-dropdown transition-all duration-200 bg-gradient-card"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {employee.avatar}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {employee.position}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Employee</DropdownMenuItem>
                    <DropdownMenuItem>View Attendance</DropdownMenuItem>
                    <DropdownMenuItem>Performance History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      getStatusVariant(employee.status) as
                        | "default"
                        | "outline"
                        | "destructive"
                        | "secondary"
                    }
                  >
                    {employee.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {employee.department}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{employee.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Started: {new Date(employee.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No employees found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
