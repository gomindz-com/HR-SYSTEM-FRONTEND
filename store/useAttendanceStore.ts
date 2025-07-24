import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios.ts";
import toast from "react-hot-toast";

interface Attendance {
  id: string;
  employeeId: string;
  companyId: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: string;
}

interface AttendanceStore {
  checkIn: (qrPayload: string) => Promise<void>;
  checkOut: (qrPayload: string) => Promise<void>;
  generateQrToken: () => Promise<string>;
  attendance: Attendance | null;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  attendance: null,
  checkIn: async (qrPayload: string) => {
    try {
      const response = await axiosInstance.post("/attendance/check-in", {
        qrPayload,
      });
      set({ attendance: response.data.data.attendance });
      toast.success("✅ Check-in successful!")

    } catch (error) {
      console.log("Error in Checkin", error);
    }
  },
  checkOut: async (qrPayload: string) => {
    try {
      const response = await axiosInstance.post("/attendance/check-out", {
        qrPayload,
      });
      set({ attendance: response.data.data.attendance });
      toast.success("✅ Check-out successful!")

    } catch (error) {
      console.log("Error in Checkout", error);
    }
  },
  generateQrToken: async () => {
    try {
      const response = await axiosInstance.get("/attendance/generate-qr");
      return response.data.data.qrToken;
    } catch (error) {
      console.log("Error in Generate Qr Token", error);
    }
  },
}));
