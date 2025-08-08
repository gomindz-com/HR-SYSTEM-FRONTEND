import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

// Enum types matching Prisma schema
export enum LeaveType {
  STUDY = "STUDY",
  MATERNITY = "MATERNITY",
  SICK = "SICK",
  PERSONAL = "PERSONAL",
  VACATION = "VACATION",
  ANNUAL = "ANNUAL",
}

export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// Employee type for nested data
export interface Employee {
  id: number;
  name: string;
  email: string;
  department?: {
    name: string;
  };
}

// LeaveRequest type matching Prisma schema
export interface LeaveRequest {
  id: number;
  employeeId: number;
  employee: Employee;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
  approverId?: number;
  approver?: Employee;
  comments?: string;
  attachmentUrls?: any;
  isApproved?: boolean;
  rejectReason?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Store state interface

interface LeaveStore {
  requests: LeaveRequest[];
  myRequests: LeaveRequest[];
  stats: {
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    totalDays: number;
    totalRequests: number;
  };
  leaveBalance: {
    daysLeft: number;
    daysUsed: number;
    pendingRequests: number;
    annualLeaveAllowance: number;
  };
  requestLeave: (
    request: Pick<
      LeaveRequest,
      "leaveType" | "startDate" | "endDate" | "comments"
    > & { attachmentUrls?: File[] }
  ) => void;
  requestingLeave: boolean;
  getLeaveRequests: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    leaveType?: string;
  }) => void;
  gettingLeaveRequests: boolean;
  getMyLeaveRequests: (params?: { page?: number; pageSize?: number }) => void;
  gettingMyLeaveRequests: boolean;
  getLeaveStats: () => void;
  gettingStats: boolean;
  getLeaveBalance: () => void;
  gettingLeaveBalance: boolean;
  approveLeave: (id: string) => void;
  approvingLeave: boolean;
  rejectLeave: (id: string, rejectReason: string) => void;
  rejectingLeave: boolean;
  // Separate pagination for each function
  allRequestsPagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  myRequestsPagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export const useLeaveStore = create<LeaveStore>((set, get) => ({
  requests: [],
  myRequests: [],
  stats: {
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalDays: 0,
    totalRequests: 0,
  },
  leaveBalance: {
    daysLeft: 0,
    daysUsed: 0,
    pendingRequests: 0,
    annualLeaveAllowance: 0,
  },
  requestingLeave: false,
  gettingLeaveRequests: false,
  gettingMyLeaveRequests: false,
  gettingStats: false,
  gettingLeaveBalance: false,
  approvingLeave: false,
  rejectingLeave: false,
  allRequestsPagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  myRequestsPagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },

  requestLeave: async (request) => {
    set({ requestingLeave: true });
    try {
      const formData = new FormData();
      formData.append("leaveType", request.leaveType);
      formData.append("startDate", request.startDate);
      formData.append("endDate", request.endDate);
      formData.append("comments", request.comments);
      if (request.attachmentUrls) {
        request.attachmentUrls.forEach((file) => {
          formData.append("attachmentUrls", file);
        });
      }
      const response = await axios.post("/api/leave/request-leave", formData);
      toast.success("Leave request sent successfully");
    } catch (error) {
      console.error("Error requesting leave:", error);
      toast.error(error.response.data.message || "Error requesting leave");
    } finally {
      set({ requestingLeave: false });
    }
  },
  getLeaveRequests: async (params = {}) => {
    set({ gettingLeaveRequests: true });
    try {
      const currentState = get();
      const queryParams = new URLSearchParams();

      // Use provided params or current state values
      queryParams.append(
        "page",
        (params.page || currentState.allRequestsPagination.page).toString()
      );
      queryParams.append(
        "pageSize",
        (
          params.pageSize || currentState.allRequestsPagination.pageSize
        ).toString()
      );

      if (params.search) queryParams.append("search", params.search);
      if (params.status && params.status !== "all")
        queryParams.append("status", params.status);
      if (params.leaveType) queryParams.append("leaveType", params.leaveType);

      const response = await axios.get(
        `/api/leave/get-leave-requests?${queryParams}`
      );
      set({
        requests: response.data.data.leaveRequests,
        allRequestsPagination: response.data.pagination,
      });
    } catch (error) {
      console.error("Error getting leave requests:", error);
      // Only show error toast for network/server errors, not for empty data
      if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
        toast.error(
          error.response?.data?.message || "Error getting leave requests"
        );
      }
    } finally {
      set({ gettingLeaveRequests: false });
    }
  },
  getMyLeaveRequests: async (params = {}) => {
    set({ gettingMyLeaveRequests: true });
    try {
      const currentState = get();
      const queryParams = new URLSearchParams();

      queryParams.append(
        "page",
        (params.page || currentState.myRequestsPagination.page).toString()
      );
      queryParams.append(
        "pageSize",
        (
          params.pageSize || currentState.myRequestsPagination.pageSize
        ).toString()
      );

      const response = await axios.get(`/api/leave/mine?${queryParams}`);
      set({
        myRequests: response.data.data.myLeaveRequests,
        myRequestsPagination: response.data.pagination,
      });
    } catch (error) {
      console.error("Error getting my leave requests:", error);
      // Only show error toast for server errors (5xx), not for auth errors (4xx) or network issues
      if (error.response?.status >= 500) {
        toast.error(
          error.response?.data?.message || "Error getting my leave requests"
        );
      }
      // For auth errors (401/403), let the axios interceptor handle it
      // For network errors, don't show toast as they might be temporary
    } finally {
      set({ gettingMyLeaveRequests: false });
    }
  },
  getLeaveStats: async () => {
    set({ gettingStats: true });
    try {
      const response = await axios.get("/api/leave/stats");
      set({
        stats: response.data.data.stats,
      });
    } catch (error) {
      console.error("Error getting leave stats:", error);
      // Only show error toast for server errors (5xx), not for auth errors (4xx) or network issues
      if (error.response?.status >= 500) {
        toast.error(
          error.response?.data?.message || "Error getting leave statistics"
        );
      }
      // For auth errors (401/403), let the axios interceptor handle it
      // For network errors, don't show toast as they might be temporary
    } finally {
      set({ gettingStats: false });
    }
  },
  getLeaveBalance: async () => {
    set({ gettingLeaveBalance: true });
    try {
      const response = await axios.get("/api/leave/balance");
      console.log("Leave balance response:", response.data);
      set({
        leaveBalance: response.data.data.leaveBalance,
      });
    } catch (error) {
      console.error("Error getting leave balance:", error);
      // Only show error toast for server errors (5xx), not for auth errors (4xx) or network issues
      if (error.response?.status >= 500) {
        toast.error(
          error.response?.data?.message || "Error getting leave balance"
        );
      }
      // For auth errors (401/403), let the axios interceptor handle it
      // For network errors, don't show toast as they might be temporary
    } finally {
      set({ gettingLeaveBalance: false });
    }
  },
  approveLeave: async (id) => {
    set({ approvingLeave: true });
    try {
      const response = await axios.post(`/api/leave/approve/${id}`);
      toast.success("Leave request approved successfully");
      // Refresh the requests and stats after approval
      get().getLeaveRequests();
      get().getLeaveStats();
      get().getLeaveBalance(); // Refresh leave balance after approval
    } catch (error) {
      console.error("Error approving leave:", error);
      toast.error(error.response?.data?.message || "Error approving leave");
    } finally {
      set({ approvingLeave: false });
    }
  },
  rejectLeave: async (id, rejectReason) => {
    set({ rejectingLeave: true });
    try {
      const response = await axios.post(`/api/leave/reject/${id}`, {
        rejectReason,
      });
      toast.success("Leave request rejected successfully");
      // Refresh the requests and stats after rejection
      get().getLeaveRequests();
      get().getLeaveStats();
      get().getLeaveBalance(); // Refresh leave balance after rejection
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast.error(error.response?.data?.message || "Error rejecting leave");
    } finally {
      set({ rejectingLeave: false });
    }
  },
}));
