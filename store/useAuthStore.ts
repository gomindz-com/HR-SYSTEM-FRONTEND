import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CompanyHRSignUpRequest,
  Department,
  Employee,
} from "../src/lib/type.ts";
import { axiosInstance } from "../src/lib/axios.ts";
import { toast } from "react-hot-toast";

interface AuthStore {
  companySignUp: (data: CompanyHRSignUpRequest) => Promise<boolean>;
  signingUp: boolean;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  loggingIn: boolean;
  logout: () => Promise<boolean>;
  loggingOut: boolean;
  checkAuth: () => Promise<void>;
  checkingAuth: boolean;
  forgotPassword: (data: { email: string }) => Promise<boolean>;
  forgotPasswordLoading: boolean;
  resetPassword: (data: {
    password: string;
    confirmPassword: string;
    token: string;
  }) => Promise<boolean>;
  resetPasswordLoading: boolean;
  authUser: Employee | null;
  sendInvitation: (data: {
    email: string;
    role: string;
    position: string;
    departmentId: number;
  }) => Promise<boolean>;
  sendingInvitation: boolean;
  acceptInvitation: (data: {
    token: string;
    password: string;
    name: string;
    position?: string;
    departmentId?: number;
  }) => Promise<boolean>;
  acceptingInvitation: boolean;
  departments: Department[];
  fetchDepartments: () => Promise<void>;
  addDepartment: (name: string) => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      signingUp: false,
      loggingIn: false,
      loggingOut: false,
      checkingAuth: false,
      forgotPasswordLoading: false,
      resetPasswordLoading: false,
      sendingInvitation: false,
      acceptingInvitation: false,
      authUser: null,
      departments: [],

      clearAuth: () => {
        set({ authUser: null });
        localStorage.removeItem("jwt_token");
      },

      companySignUp: async (data) => {
        set({ signingUp: true });
        try {
          const response = await axiosInstance.post(
            "/auth/company-signup",
            data
          );
          set({ authUser: response.data.data.newHR });
          return true;
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to sign up company"
          );
          return false;
        } finally {
          set({ signingUp: false });
        }
      },
      login: async (data) => {
        set({ loggingIn: true });
        try {
          const response = await axiosInstance.post("/auth/login", data);
          set({ authUser: response.data.data.user });

          // Store JWT token in localStorage
          if (response.data.data.token) {
            localStorage.setItem("jwt_token", response.data.data.token);
          }

          toast.success("Logged in successfully");
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to login");
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

          // Clear JWT token from localStorage
          localStorage.removeItem("jwt_token");

          toast.success("Logged out successfully");
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
          // Check if token exists in localStorage
          const token = localStorage.getItem("jwt_token");
          if (!token) {
            console.log("No token found, clearing auth state");
            set({ authUser: null, checkingAuth: false });
            return;
          }

          console.log("Making checkAuth request...");
          const response = await axiosInstance.get("/auth/check-auth");
          console.log("checkAuth success:", response.data);
          set({ authUser: response.data.data.user });
        } catch (error) {
          console.log(
            "checkAuth error:",
            error.response?.data || error.message
          );
          // If checkAuth fails, clear the token and auth state
          set({ authUser: null });
          localStorage.removeItem("jwt_token");

          // Show toast for expired session
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            toast.error("Session expired. Please log in again.");
          }
        } finally {
          set({ checkingAuth: false });
        }
      },
      forgotPassword: async (data) => {
        set({ forgotPasswordLoading: true });
        try {
          const response = await axiosInstance.post(
            "/auth/forgot-password",
            data
          );
          set({ forgotPasswordLoading: false });
          toast.success("Password reset email sent");
          return true;
        } catch (error) {
          set({ forgotPasswordLoading: false });
          toast.error(
            error.response?.data?.message ||
              "Failed to send password reset email"
          );
          return false;
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
          return true;
        } catch (error) {
          set({ resetPasswordLoading: false });
          toast.error(
            error.response?.data?.message || "Failed to reset password"
          );
          return false;
        } finally {
          set({ resetPasswordLoading: false });
        }
      },
      fetchDepartments: async () => {
        try {
          const res = await axiosInstance.get("/department");
          console.log("Departments response:", res.data);
          set({ departments: res.data.data });
        } catch (error) {
          console.error("Error fetching departments:", error);
          toast.error(
            error.response?.data?.message || "Failed to fetch departments"
          );
        }
      },
      addDepartment: async (name: string) => {
        try {
          // send { name } in body
          const res = await axiosInstance.post("/department", { name });
          const newDept = res.data.data;
          toast.success("Department added");
          // append the newly created department
          set({ departments: [...get().departments, newDept] });
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to add department"
          );
        }
      },
      sendInvitation: async ({
        email,
        role,
        position,
        departmentId,
      }: {
        email: string;
        role: string;
        position: string;
        departmentId: number;
      }) => {
        if (!departmentId) {
          toast.error("Please select or add a department first");
          return false;
        }
        set({ sendingInvitation: true });
        try {
          await axiosInstance.post("/invitation/send-invitation", {
            email,
            role,
            position,
            departmentId,
          });
          toast.success("Invitation sent successfully");
          return true;
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to send invitation"
          );
          return false;
        } finally {
          set({ sendingInvitation: false });
        }
      },
      acceptInvitation: async ({
        token,
        name,
        password,
      }: {
        token: string;
        name: string;
        password: string;
      }) => {
        set({ acceptingInvitation: true });
        try {
          await axiosInstance.post(`/invitation/accept-invitation/${token}`, {
            name,
            password,
            confirmPassword: password,
          });
          toast.success("Invitation accepted—please log in");
          return true;
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to accept invitation"
          );
          return false;
        } finally {
          set({ acceptingInvitation: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ authUser: state.authUser }),
    }
  )
);
