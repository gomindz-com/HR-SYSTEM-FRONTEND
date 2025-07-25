import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios.ts";

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  position?: string;
  departmentId: number;
  department?: { id: number; name: string };
  companyId: number;
  location?: string;
  status: string;
  avatar?: string;
  role: string;
  createdAt: string;
  address?: string;
}

interface EmployeePagination {
  employees: Employee[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface EmployeeStore {
  employeeList: Employee[];
  employeePagination: EmployeePagination | null;
  fetchEmployees: (params?: {
    page?: number;
    pageSize?: number;
    name?: string;
    email?: string;
    departmentId?: number;
    status?: string;
    role?: string;
  }) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employeeList: [],
  employeePagination: null,
  fetchEmployees: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/employee", { params });
      const { employees, page, pageSize, total, totalPages } = response.data.data;
      set({
        employeeList: employees,
        employeePagination: { employees, page, pageSize, total, totalPages },
      });
    } catch (error) {
      console.log("Error fetching employee list", error);
    }
  },
}));