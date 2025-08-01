"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email(),
  companyTin: z.string().min(1, "Company TIN is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyDescription: z.string().min(1, "Description is required"),
  HRName: z.string().min(1, "HR name is required"),
  HRPhone: z.string().min(1, "HR phone is required"),
  HRAddress: z.string().min(1, "HR address is required"),
  HREmail: z.string().email(),
  HRPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmHRPassword: z.string().min(8, "Confirm password is required"),
});
const CompanySignup = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      companyName: "",
      companyEmail: "",
      companyTin: "",
      companyAddress: "",
      companyDescription: "",
      HRName: "",
      HRPhone: "",
      HRAddress: "",
      HREmail: "",
      HRPassword: "",
      confirmHRPassword: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { companySignUp, signingUp } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await companySignUp({
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        companyTin: data.companyTin,
        companyAddress: data.companyAddress,
        companyDescription: data.companyDescription,
        HRName: data.HRName,
        HRPhone: data.HRPhone,
        HRAddress: data.HRAddress,
        HREmail: data.HREmail,
        HRPassword: data.HRPassword,
        confirmHRPassword: data.confirmHRPassword,
      });

      if (response) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-[60%_40%] xl:grid-cols-[65%_35%] bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Form Section */}
        <div className="flex flex-col justify-center p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto max-h-screen">
          <div className="w-full max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Create Your Account
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Sign up for HR Management System
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Company Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground border-b pb-2">
                    Company Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Company Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter company name"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Company Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter company email"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyTin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Company TIN
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter company TIN"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Company Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter company address"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyDescription"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="text-sm font-medium">
                            Company Description
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter company description"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* HR Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground border-b pb-2">
                    HR Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="HRName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            HR Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter HR name"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="HRPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            HR Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter HR phone"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="HRAddress"
                      render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel className="text-sm font-medium">
                            HR Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter HR address"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="HREmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            HR Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter HR email"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="HRPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            HR Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter HR password"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmHRPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Confirm HR Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm HR password"
                              className="h-11 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={signingUp}
                >
                  {signingUp ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-primary hover:underline transition-colors"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative hidden lg:block bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <img
            src="/side.jpg"
            alt="HR Management System"
            className="w-full h-full object-cover mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;
