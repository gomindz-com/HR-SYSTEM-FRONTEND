import { axiosInstance } from "../src/lib/axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

interface CompanySettings {
  id: number;
  companyName: string;
  workStartTime: string;
  workEndTime: string;
  lateThreshold: number;
  checkInDeadline: number;
}

interface CompanyStore {
  settings: CompanySettings | null;
  isLoading: boolean;
  isUpdating: boolean;
  timezones: string[];
  isLoadingTimezones: boolean;

  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<CompanySettings>) => Promise<void>;
  fetchTimezones: () => Promise<void>;
}

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  settings: null,
  isLoading: false,
  isUpdating: false,
  timezones: [],
  isLoadingTimezones: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/company/attendance-settings");
      set({ settings: response.data.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching company settings"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (data: Partial<CompanySettings>) => {
    set({ isUpdating: true });
    try {
      const response = await axiosInstance.put(
        "/company/attendance-settings",
        data
      );
      set({ settings: response.data.data });
      toast.success("Company settings updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating company settings"
      );
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  fetchTimezones: async () => {
    set({ isLoadingTimezones: true });
    try {
      const response = await axiosInstance.get("/company/timezones");
      set({ timezones: response.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching timezones");
    } finally {
      set({ isLoadingTimezones: false });
    }
  },
}));
