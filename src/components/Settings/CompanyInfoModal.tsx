import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, FileText } from "lucide-react";
import { RiBuilding2Line } from "react-icons/ri";
import { useCompanyStore } from "../../../store/useCompanyStore";
import { useAuthStore } from "../../../store/useAuthStore";

// Zod schema for form validation
const companyInfoSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  companyEmail: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Company email is required"),
  companyTin: z.string().min(1, "Company TIN is required"),
  companyAddress: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),
  companyDescription: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

type CompanyInfoFormData = z.infer<typeof companyInfoSchema>;

interface CompanyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CompanyInfoModal({
  isOpen,
  onClose,
}: CompanyInfoModalProps) {
  const { companyInfo, isUpdatingInfo, fetchCompanyInfo, updateCompanyInfo } =
    useCompanyStore();
  const { authUser } = useAuthStore();

  const form = useForm<CompanyInfoFormData>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: "",
      companyEmail: "",
      companyTin: "",
      companyAddress: "",
      companyDescription: "",
    },
  });

  // Load company info when modal opens
  useEffect(() => {
    if (isOpen && !companyInfo) {
      fetchCompanyInfo();
    }
  }, [isOpen, companyInfo, fetchCompanyInfo]);

  // Update form when company info is loaded
  useEffect(() => {
    if (companyInfo) {
      form.reset({
        companyName: companyInfo.companyName || "",
        companyEmail: companyInfo.companyEmail || "",
        companyTin: companyInfo.companyTin || "",
        companyAddress: companyInfo.companyAddress || "",
        companyDescription: companyInfo.companyDescription || "",
      });
    }
  }, [companyInfo, form]);

  const onSubmit = async (data: CompanyInfoFormData) => {
    try {
      await updateCompanyInfo(data);
      onClose();
    } catch (error) {
      console.error("Company info update failed:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <RiBuilding2Line className="h-6 w-6 text-blue-600" />
            Update Company Information
          </DialogTitle>
          <DialogDescription>
            Update your company's basic information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Company Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <RiBuilding2Line className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Enter company name"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Email */}
              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Company Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="company@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company TIN */}
              <FormField
                control={form.control}
                name="companyTin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Company TIN
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Enter TIN number"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Tax Identification Number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company Address */}
              <FormField
                control={form.control}
                name="companyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Company Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Enter company address"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Company Description */}
            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Company Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your company..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Optional: Brief description of your company's business
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdatingInfo}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingInfo}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdatingInfo ? "Updating..." : "Update Company Info"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
