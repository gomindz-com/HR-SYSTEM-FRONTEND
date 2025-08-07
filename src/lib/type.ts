export type Employee = {
  id: number;
  name: string;
  email: string;
  company: Company;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  phone?: string;
  attendance: {
    id: number;
    checkInTime: string;
    checkOutTime: string;
    date: string;
  };
  profilePic?: string;
  position?: string;
  departmentId: number;
  department: {
    name: string;
  };
  companyId: number;
  location?: string;
  startDate: string;
  avatar?: string;
  role: "EMPLOYEE" | "DIRECTOR" | "HR";
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR";
  salary?: number;
  lastLogin?: string;
  createdAt: string;
};

export type Company = {
  id: number;
  companyName: string;
  companyEmail: string;
  companyTin: string;
  companyAddress: string;
  hrId: number;
  companyDescription: string;
  timezone: string;
  createdAt: string;
};

export type CompanyHRSignUpRequest = {
  companyName: string;
  companyEmail: string;
  companyTin: string;
  companyAddress: string;
  companyDescription: string;
  timezone: string;
  HRName: string;
  HRPhone: string;
  HRAddress: string;
  HREmail: string;
  HRPassword: string;
  confirmHRPassword: string;
};

export type Department = {
  id: number;
  name: string;
  managerId: number;
  companyId: number;
  createdAt: string;
  updatedAt: string;
};
