export type Employee = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  position?: string;
  departmentId: number;
  companyId: number;
  location?: string;
  startDate: string; // ISO date string
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  avatar?: string;
  role: "EMPLOYEE" | "DIRECTOR" | "HR";
  dateOfBirth?: string; // ISO date string
  address?: string;
  emergencyContact?: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR";
  salary?: number;
  lastLogin?: string; // ISO date string
  createdAt: string; // ISO date string
};

export type Company = {
  id: number;
  companyName: string;
  companyEmail: string;
  companyTin: string;
  companyAddress: string;
  hrId: number;
  companyDescription: string;
  createdAt: string;
};


export type CompanyHRSignUpRequest = {
  companyName: string;
  companyEmail: string;
  companyTin: string;
  companyAddress: string;
  companyDescription: string;
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
}