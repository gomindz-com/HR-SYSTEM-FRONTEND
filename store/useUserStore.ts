import { Employee } from "../src/lib/type";
import { axiosInstance } from "../src/lib/axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";

interface UpdateData {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  profilePic?: File;
}

interface UserStore {
  isUpdating: boolean;
  updateUserProfile: (data: UpdateData) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isUpdating: false,
  updateUserProfile: async (data: UpdateData) => {
    set({ isUpdating: true });
    try {
      const form = new FormData();
      if (data.profilePic) form.append("profilePic", data.profilePic);
      if (data.name) form.append("name", data.name);
      if (data.email) form.append("email", data.email);
      if (data.phone) form.append("phone", data.phone);
      if (data.position) form.append("position", data.position);
      if (data.address) form.append("address", data.address);
      if (data.dateOfBirth) form.append("dateOfBirth", data.dateOfBirth);
      if (data.emergencyContact)
        form.append("emergencyContact", data.emergencyContact);

      const response = await axiosInstance.put(
        "/user/update-profile",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully");
      return response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating your profile"
      );
      return null;
    } finally {
      set({ isUpdating: false });
    }
  },
}));
