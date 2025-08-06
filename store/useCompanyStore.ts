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

interface CompanyInfo {
  id: number;
  companyName: string;
  companyEmail: string;
  companyTin: string;
  companyAddress: string;
  companyDescription: string;
}

interface CompanyStore {
  settings: CompanySettings | null;
  companyInfo: CompanyInfo | null;
  isLoading: boolean;
  isUpdating: boolean;
  isUpdatingInfo: boolean;
  timezones: string[];
  isLoadingTimezones: boolean;

  // Actions
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<CompanySettings>) => Promise<void>;
  fetchCompanyInfo: () => Promise<void>;
  updateCompanyInfo: (data: Partial<CompanyInfo>) => Promise<void>;
  fetchTimezones: () => Promise<void>;
}

export const useCompanyStore = create<CompanyStore>((set, get) => ({
  settings: null,
  companyInfo: null,
  isLoading: false,
  isUpdating: false,
  isUpdatingInfo: false,
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

  fetchCompanyInfo: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/company/info");
      set({ companyInfo: response.data.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching company info"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  updateCompanyInfo: async (data: Partial<CompanyInfo>) => {
    set({ isUpdatingInfo: true });
    try {
      const response = await axiosInstance.put("/company/info", data);
      set({ companyInfo: response.data.data });
      // Also update the company name in settings if it was changed
      if (data.companyName && get().settings) {
        set({
          settings: { ...get().settings!, companyName: data.companyName },
        });
      }
      toast.success("Company information updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating company information"
      );
      throw error;
    } finally {
      set({ isUpdatingInfo: false });
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
