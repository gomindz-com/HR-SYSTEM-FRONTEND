import { create } from "zustand";
import { Company, Employee } from "../src/lib/type.ts";
import { axiosInstance } from "../src/lib/axios.ts";
import { toast } from "react-hot-toast";

interface AuthStore {
  companySignUp: (data: Company) => Promise<boolean>;
  signingUp: boolean;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  loggingIn: boolean;
  logout: () => Promise<boolean>;
  loggingOut: boolean;
  checkAuth: () => Promise<void>;
  checkingAuth: boolean;
  forgotPassword: (data: { email: string }) => Promise<void>;
  forgotPasswordLoading: boolean;
  resetPassword: (data: {
    password: string;
    confirmPassword: string;
    token: string;
  }) => Promise<void>;
  resetPasswordLoading: boolean;
  authUser: Employee | null;
  sendInvitation: (data: {
    email: string;
    role: string;
    position: string;
  }) => Promise<void>;
  sendingInvitation: boolean;
  acceptInvitation: (data: {
    token: string;
    password: string;
    name: string;
    position?: string;
  }) => Promise<void>;
  acceptingInvitation: boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  signingUp: false,
  loggingIn: false,
  loggingOut: false,
  checkingAuth: false,
  forgotPasswordLoading: false,
  resetPasswordLoading: false,
  sendingInvitation: false,
  acceptingInvitation: false,
  authUser: null,

  companySignUp: async (data) => {
    set({ signingUp: true });
    try {
      const response = await axiosInstance.post("/auth/company-signup", data);
      set({ authUser: response.data.data.newHR });
      return true;
    } catch (error) {
      set({ signingUp: false });
      toast.error("Failed to sign up company");
      return false;
    }
  },
  login: async (data) => {
    set({ loggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", data);
      set({ authUser: response.data.data.user });
      return true;
    } catch (error) {
      set({ loggingIn: false });
      toast.error("Failed to login");
      return false;
    } finally {
      set({ loggingIn: false });
    }
  },
  logout: async () => {
    set({ loggingOut: true });
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      return true;
    } catch (error) {
      set({ loggingOut: false });
      toast.error("Failed to logout");
      return false;
    } finally {
      set({ loggingOut: false });
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      set({ authUser: response.data.user });
    } catch (error) {
      set({ checkingAuth: false });
      toast.error("Failed to check auth");
    } finally {
      set({ checkingAuth: false });
    }
  },
  forgotPassword: async (data) => {
    set({ forgotPasswordLoading: true });
    try {
      const response = await axiosInstance.post("/auth/forgot-password", data);
      set({ forgotPasswordLoading: false });
      toast.success("Password reset email sent");
    } catch (error) {
      set({ forgotPasswordLoading: false });
      toast.error("Failed to send password reset email");
    }
  },
  resetPassword: async (data) => {
    set({ resetPasswordLoading: true });
    try {
      // Backend expects { newPassword } in body
      const response = await axiosInstance.post(
        `/auth/reset-password/${data.token}`,
        { newPassword: data.password }
      );
      set({ resetPasswordLoading: false });
      toast.success("Password reset successfully");
    } catch (error) {
      set({ resetPasswordLoading: false });
      toast.error("Failed to reset password");
    } finally {
      set({ resetPasswordLoading: false });
    }
  },
  sendInvitation: async (data) => {
    set({ sendingInvitation: true });
    try {
      const response = await axiosInstance.post(
        "/invitation/send-invitation",
        data
      );
      set({ sendingInvitation: false });
      toast.success("Invitation sent successfully");
    } catch (error) {
      set({ sendingInvitation: false });
      toast.error("Failed to send invitation");
    } finally {
      set({ sendingInvitation: false });
    }
  },
  acceptInvitation: async (data) => {
    set({ acceptingInvitation: true });
    try {
      // Backend expects: { name, password, confirmPassword, position }
      const payload = {
        name: data.name,
        password: data.password,
        confirmPassword: data.password, // assuming confirmPassword is same as password from frontend
        position: data.position || "EMPLOYEE", // fallback if not provided
      };
      const response = await axiosInstance.post(
        `/invitation/accept-invitation/${data.token}`,
        payload
      );
      set({ acceptingInvitation: false });
      toast.success(
        "Invitation accepted successfully, please login to continue"
      );
    } catch (error) {
      set({ acceptingInvitation: false });
      toast.error("Failed to accept invitation");
    } finally {
      set({ acceptingInvitation: false });
    }
  },
}));
