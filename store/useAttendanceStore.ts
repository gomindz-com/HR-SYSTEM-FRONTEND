import { create } from "zustand";
import { axiosInstance } from "../src/lib/axios.ts";
import toast from "react-hot-toast";
import { offlineDB } from "../src/lib/offlineDB";

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
  syncOfflineActions: () => Promise<void>;
  attendance: Attendance | null;
}

export const useAttendanceStore = create<AttendanceStore>((set, get) => ({
  attendance: null,

  checkIn: async (qrPayload: string) => {
    if (!navigator.onLine) {
      await offlineDB.actions.add({
        actionType: "check-in",
        qrPayload,
        scannedAt: new Date().toISOString(),
      });
      toast.success("✅ Check-in saved offline. Will sync when online.");
      return;
    }

    try {
      const response = await axiosInstance.post("/attendance/check-in", {
        qrPayload,
      });
      set({ attendance: response.data.data.attendance });
      toast.success("✅ Check-in successful!");
    } catch (error) {
      console.log("Error in Checkin", error);
    }
  },

  checkOut: async (qrPayload: string) => {
    if (!navigator.onLine) {
      await offlineDB.actions.add({
        actionType: "check-out",
        qrPayload,
        scannedAt: new Date().toISOString(),
      });
      toast.success("✅ Check-out saved offline. Will sync when online.");
      return;
    }

    try {
      const response = await axiosInstance.post("/attendance/check-out", {
        qrPayload,
      });
      set({ attendance: response.data.data.attendance });
      toast.success("✅ Check-out successful!");
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
      return "";
    }
  },

  syncOfflineActions: async () => {
    const actions = await offlineDB.actions.toArray();
    for (const action of actions) {
      try {
        await axiosInstance.post(
          `/attendance/${action.actionType}`,
          {
            qrPayload: action.qrPayload,
            scannedAt: action.scannedAt, // used for backend to validate old JWT
          }
        );
        await offlineDB.actions.delete(action.id!);
        console.log(`Synced ${action.actionType} at ${action.scannedAt}`);
      } catch (err) {
        console.error("Failed to sync action", err);
      }
    }
  },


  
}));
