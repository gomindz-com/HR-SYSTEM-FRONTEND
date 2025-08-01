import { useState, useEffect, useRef } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  ChevronsUpDown,
  Check,
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
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/useAuthStore";
import { useEmployeeStore } from "../../store/useEmployeeStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { createPortal } from "react-dom";
import { axiosInstance } from "../../src/lib/axios";

// These are only for the invite modal, not for the employee list
const statuses = ["All Statuses", "ACTIVE", "ON_LEAVE", "INACTIVE"];

const inviteFormSchema = z.object({
  email: z.string().email(),
  role: z.enum(["EMPLOYEE", "DIRECTOR", "HR"]),
  position: z.string().min(1, "Position is required"),
  departmentId: z.number({ required_error: "Department is required" }),
});

const departmentFormSchema = z.object({
  name: z.string().min(1, "Department name is required"),
});

// Custom Modal for Add Department
function CustomModal({ open, onClose, children, className = "" }) {
  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className={`bg-white dark:bg-background rounded-lg shadow-lg p-6 relative ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeWidth="2"
              d="M6 6l12 12M6 18L18 6"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [departmentModalOpen, setDepartmentModalOpen] = useState(false);
  const [employeeDetailsModalOpen, setEmployeeDetailsModalOpen] =
    useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingEmployeeDetails, setLoadingEmployeeDetails] = useState(false);

  // Auth store for departments and invite logic
  const {
    departments: authDepartments,
    fetchDepartments,
    addDepartment,
    sendInvitation,
    sendingInvitation,
  } = useAuthStore();

  // Employee store (dynamic, from backend)
  const { employeeList, employeePagination, fetchEmployees } =
    useEmployeeStore();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Fetch employees when filters/search change
  useEffect(() => {
    fetchEmployees({
      page: 1,
      pageSize: 30,
      name: searchQuery || undefined,
      status: selectedStatus !== "All Statuses" ? selectedStatus : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedStatus]);

  const inviteForm = useForm<z.infer<typeof inviteFormSchema>>({
    defaultValues: {
      email: "",
      role: "EMPLOYEE",
      position: "",
      departmentId: undefined,
    },
    resolver: zodResolver(inviteFormSchema),
  });

  const { toast } = useToast();

  // Inline department add handler (no popover state)
  async function handleAddDepartment() {
    if (!newDepartment.trim()) return;
    setAddingDepartment(true);
    await addDepartment(newDepartment);
    setNewDepartment("");
    setAddingDepartment(false);
    setDepartmentModalOpen(false);
  }

  const handleViewEmployeeDetails = async (employee) => {
    setSelectedEmployee(employee);
    setEmployeeDetailsModalOpen(true);
    setLoadingEmployeeDetails(true);

    try {
      const response = await axiosInstance.get(`/employee/${employee.id}`);
      setSelectedEmployee(response.data.data);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast({
        title: "Error",
        description: "Failed to load employee details",
        variant: "destructive",
      });
    } finally {
      setLoadingEmployeeDetails(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "secondary";
      case "ON_LEAVE":
        return "outline";
      case "INACTIVE":
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
        <Button
          className="bg-gradient-primary hover:opacity-90 transition-opacity"
          onClick={() => setInviteModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Invite Employee
        </Button>
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "ACTIVE"
                        ? "Active"
                        : status === "ON_LEAVE"
                        ? "On Leave"
                        : status === "INACTIVE"
                        ? "Inactive"
                        : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {employeeList.length} of{" "}
              {employeePagination?.total ?? employeeList.length} employees
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employeeList.map((employee) => (
          <Card
            key={employee.id}
            className="shadow-card hover:shadow-dropdown transition-all duration-200 bg-gradient-card"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center overflow-hidden">
                    {employee.profilePic ? (
                      <img
                        src={employee.profilePic}
                        alt={employee.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    )}
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
                    <DropdownMenuItem
                      onClick={() => handleViewEmployeeDetails(employee)}
                    >
                      View Details
                    </DropdownMenuItem>
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
                    {employee.status === "ACTIVE"
                      ? "Active"
                      : employee.status === "ON_LEAVE"
                      ? "On Leave"
                      : employee.status === "INACTIVE"
                      ? "Inactive"
                      : employee.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {employee.department?.name}
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
                    <span>{employee?.address}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Started:{" "}
                    {employee.createdAt
                      ? new Date(employee.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {employeeList.length === 0 && (
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

      {/* Custom Invite Modal */}
      <CustomModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      >
        <h2 className="text-xl font-bold mb-2">Invite Employee</h2>
        <p className="text-muted-foreground mb-4">
          Fill out the form to invite a new employee.
        </p>
        <Form {...inviteForm}>
          <form
            className="grid gap-4 py-4"
            onSubmit={inviteForm.handleSubmit(async (data) => {
              try {
                const success = await sendInvitation({
                  email: data.email,
                  role: data.role,
                  position: data.position,
                  departmentId: data.departmentId,
                });
                if (success) {
                  setInviteModalOpen(false);
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
                    <Select value={field.value} onValueChange={field.onChange}>
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
            <FormField
              control={inviteForm.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Department</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={
                            !field.value
                              ? "justify-between text-sm font-normal text-muted-foreground"
                              : "justify-between text-sm font-normal"
                          }
                        >
                          {field.value
                            ? authDepartments.find(
                                (dep) => dep.id === field.value
                              )?.name
                            : "Select department"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <div className="flex items-center border-b px-3">
                          <CommandInput
                            placeholder="Search department..."
                            className="border-0 py-3 h-9"
                          />
                          {/* Custom Modal Trigger for Add Department */}
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            className="h-8 w-8 ml-1"
                            onClick={() => setDepartmentModalOpen(true)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <CommandList>
                          <CommandEmpty>No departments found.</CommandEmpty>
                          <CommandGroup>
                            {authDepartments.map((dep) => (
                              <CommandItem
                                key={dep.id}
                                value={dep.name}
                                onSelect={() => {
                                  inviteForm.setValue("departmentId", dep.id, {
                                    shouldValidate: true,
                                  });
                                }}
                              >
                                <Check
                                  className={
                                    dep.id === field.value
                                      ? "mr-2 h-4 w-4 opacity-100"
                                      : "mr-2 h-4 w-4 opacity-0"
                                  }
                                />
                                {dep.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button type="submit" disabled={sendingInvitation}>
                {sendingInvitation ? "Sending..." : "Send Invitation"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => setInviteModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CustomModal>

      {/* Custom Department Modal */}
      <CustomModal
        open={departmentModalOpen}
        onClose={() => setDepartmentModalOpen(false)}
      >
        <h2 className="text-lg font-semibold mb-2">Add New Department</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Give your new department a name.
        </p>
        <Input
          placeholder="Enter department name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          disabled={addingDepartment}
        />
        <div className="flex gap-2 justify-end pt-2">
          <Button
            className="bg-[#4A00E0] hover:bg-[#4A00E0]/70 text-white"
            disabled={!newDepartment.trim() || addingDepartment}
            onClick={handleAddDepartment}
          >
            {addingDepartment ? "Adding..." : "Add Department"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setDepartmentModalOpen(false)}
            disabled={addingDepartment}
          >
            Cancel
          </Button>
        </div>
      </CustomModal>

      {/* Employee Details Modal */}
      <CustomModal
        open={employeeDetailsModalOpen}
        onClose={() => setEmployeeDetailsModalOpen(false)}
        className="min-w-[800px] max-w-[1200px] max-h-[90vh] overflow-y-auto"
      >
        {loadingEmployeeDetails ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">
              Loading employee details...
            </span>
          </div>
        ) : selectedEmployee ? (
          <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  {selectedEmployee.profilePic ? (
                    <img
                      src={selectedEmployee.profilePic}
                      alt={selectedEmployee.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {selectedEmployee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Employee Details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmployee.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground border-b pb-2">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Name
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Email
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Position
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.position || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Role
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Status
                    </span>
                    <Badge variant={getStatusVariant(selectedEmployee.status)}>
                      {selectedEmployee.status === "ACTIVE"
                        ? "Active"
                        : selectedEmployee.status === "ON_LEAVE"
                        ? "On Leave"
                        : selectedEmployee.status === "INACTIVE"
                        ? "Inactive"
                        : selectedEmployee.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Department & Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground border-b pb-2">
                  Department & Contact
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Department
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.department?.name || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Phone
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Address
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.address || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Emergency Contact
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.emergencyContact || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.dateOfBirth
                        ? new Date(
                            selectedEmployee.dateOfBirth
                          ).toLocaleDateString()
                        : "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Employment & Company */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground border-b pb-2">
                  Employment & Company
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Company
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.company?.companyName || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Employment Type
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.employmentType === "FULL_TIME"
                        ? "Full Time"
                        : selectedEmployee.employmentType === "PART_TIME"
                        ? "Part Time"
                        : selectedEmployee.employmentType === "CONTRACT"
                        ? "Contract"
                        : selectedEmployee.employmentType === "INTERNSHIP"
                        ? "Internship"
                        : selectedEmployee.employmentType === "FREELANCE"
                        ? "Freelance"
                        : selectedEmployee.employmentType || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.createdAt
                        ? new Date(
                            selectedEmployee.createdAt
                          ).toLocaleDateString()
                        : "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Last Login
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.lastLogin
                        ? new Date(
                            selectedEmployee.lastLogin
                          ).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Salary
                    </span>
                    <span className="text-sm text-foreground">
                      {selectedEmployee.salary
                        ? `$${selectedEmployee.salary.toLocaleString()}`
                        : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Attendance - Full Width */}
            <div className="mt-6 space-y-4">
              <h3 className="font-semibold text-lg text-foreground border-b pb-2">
                Recent Attendance
              </h3>
              {selectedEmployee.attendances &&
              selectedEmployee.attendances.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedEmployee.attendances.map((attendance) => (
                    <div
                      key={attendance.id}
                      className="p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {new Date(attendance.date).toLocaleDateString()}
                        </span>
                        <Badge
                          variant={
                            attendance.status === "ON_TIME"
                              ? "secondary"
                              : attendance.status === "LATE"
                              ? "outline"
                              : attendance.status === "ABSENT"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {attendance.status === "ON_TIME"
                            ? "On Time"
                            : attendance.status === "LATE"
                            ? "Late"
                            : attendance.status === "ABSENT"
                            ? "Absent"
                            : attendance.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {attendance.timeIn
                          ? new Date(attendance.timeIn).toLocaleTimeString()
                          : "No check-in"}{" "}
                        -
                        {attendance.timeOut
                          ? new Date(attendance.timeOut).toLocaleTimeString()
                          : "No check-out"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No recent attendance records
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No employee data available</p>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
