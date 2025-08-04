import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios.ts";
import toast from "react-hot-toast";

interface Attendance {
  id: string;
  employeeId: string;
  companyId: string;
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  status: string;
  employee?: {
    id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
}

interface AttendancePagination {
  attendance: Attendance[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
interface AttendanceStore {
  checkIn: (qrPayload: string) => Promise<void>;
  checkOut: (qrPayload: string) => Promise<void>;

  attendance: Attendance | null;
  fetchAttendance: (params?: {
    page?: number;
    pageSize?: number;
    employeeId?: string;
    status?: string;
  }) => Promise<void>;
  attendanceList: Attendance[];
  attendancePagination: AttendancePagination | null;

  myAttendaneList: Attendance[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
  fetchMyAttendance: (params?: {
    page?: number;
    limit?: number;
  }) => Promise<void>;
  fetchingMine: boolean;

  getAttendanceStats: () => Promise<void>;
  gettingStats: boolean;
  attendanceStats: {
    daysLate: number;
    daysAbsent: number;
    attendancePercentage: number;
    daysOnTime: number;
  };
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  attendance: null,
  attendanceList: [],
  attendancePagination: null,
  myAttendaneList: [],
  fetchingMine: false,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  },
  gettingStats: false,
  attendanceStats: {
    daysLate: 0,
    daysAbsent: 0,
    attendancePercentage: 0,
    daysOnTime: 0,
  },

  getAttendanceStats: async () => {
    set({ gettingStats: true });
    try {
      const response = await axiosInstance.get("/attendance/stats");
      set({ attendanceStats: response.data.data });
    } catch (error) {
      console.log("Error in Get Attendance Stats", error);
    } finally {
      set({ gettingStats: false });
    }
  },

  checkIn: async (qrPayload: string) => {
    try {
      const response = await axiosInstance.post("/attendance/check-in", {
        qrPayload,
      });
      set({ attendance: response.data.data.attendance });
      toast.success("✅ Check-in successful!");
      await get().fetchMyAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Check-in failed!");
      console.log("Error in Checkin", error);
    }
  },
  checkOut: async (qrPayload: string) => {
    try {
      const response = await axiosInstance.post("/attendance/check-out", {
        qrPayload,
      });
      set({ attendance: response.data.data.attendance });
      toast.success("✅ Check-out successful!");
      await get().fetchMyAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Check-out failed!");
      console.log("Error in Checkout", error);
    }
  },

  fetchAttendance: async (params = {}) => {
    try {
      const response = await axiosInstance.get("/attendance", {
        params, // e.g., { page: 1, pageSize: 50, status: "PRESENT" }
      });
      console.log("Attendance data:", response.data.data);
      const { attendance, page, pageSize, total, totalPages } =
        response.data.data;
      set({
        attendanceList: attendance,
        attendancePagination: { attendance, page, pageSize, total, totalPages },
      });
    } catch (error) {
      console.log("Error fetching attendance list", error);
    }
  },

  fetchMyAttendance: async (params = {}) => {
    set({ fetchingMine: true });
    try {
      const response = await axiosInstance.get("/attendance/my-attendance", {
        params,
      });
      const { attendance, page, limit, totalPages, total } = response.data.data;
      set({
        myAttendaneList: attendance,
        pagination: { page, limit, totalPages, total },
      });
    } catch (error) {
      console.log("Error fetching my attendance", error);
    } finally {
      set({ fetchingMine: false });
    }
  },
}));
