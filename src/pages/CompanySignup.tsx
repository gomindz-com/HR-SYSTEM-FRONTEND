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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email(),
  companyTin: z.string().min(1, "Company TIN is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyDescription: z.string().min(1, "Description is required"),
  timezone: z.string().min(1, "Timezone is required"),
  HRName: z.string().min(1, "HR name is required"),
  HRPhone: z.string().min(1, "HR phone is required"),
  HRAddress: z.string().min(1, "HR address is required"),
  HREmail: z.string().email(),
  HRPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmHRPassword: z.string().min(8, "Confirm password is required"),
});

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  currentTime: string;
}

interface GroupedTimezones {
  Popular: TimezoneOption[];
  Africa: TimezoneOption[];
  America: TimezoneOption[];
  Asia: TimezoneOption[];
  Europe: TimezoneOption[];
  Pacific: TimezoneOption[];
  Australia: TimezoneOption[];
  Other: TimezoneOption[];
}

const CompanySignup = () => {
  console.log("CompanySignup component rendering");
  const [timezones, setTimezones] = useState<GroupedTimezones | null>(null);
  const [loadingTimezones, setLoadingTimezones] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      companyName: "",
      companyEmail: "",
      companyTin: "",
      companyAddress: "",
      companyDescription: "",
      timezone: "",
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

  // Fetch timezones on component mount
  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        console.log("Fetching timezones...");
        const response = await axiosInstance.get("/company/timezones");
        console.log("Timezones response:", response.data);
        setTimezones(response.data.data);
      } catch (error) {
        console.error("Error fetching timezones:", error);
        // Set a default timezone structure to prevent the component from breaking
        setTimezones({
          Popular: [
            {
              value: "UTC",
              label: "UTC (Coordinated Universal Time)",
              offset: "+00:00",
              currentTime: "Current UTC time",
            },
          ],
          Africa: [],
          America: [],
          Asia: [],
          Europe: [],
          Pacific: [],
          Australia: [],
          Other: [],
        });
      } finally {
        setLoadingTimezones(false);
      }
    };

    fetchTimezones();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await companySignUp({
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        companyTin: data.companyTin,
        companyAddress: data.companyAddress,
        companyDescription: data.companyDescription,
        timezone: data.timezone,
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
    <div className="min-h-screen flex bg-gradient-to-br from-background to-muted/20">
      <div className="w-full grid lg:grid-cols-[60%_40%] xl:grid-cols-[65%_35%]">
        {/* Form Section */}
        <div className="flex flex-col justify-center p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto min-h-screen">
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

                {/* Timezone Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground border-b pb-2">
                    Timezone
                  </h2>
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Select Timezone
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 text-base">
                              <SelectValue placeholder="Select a timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {loadingTimezones ? (
                              <SelectItem value="loading" disabled>
                                Loading timezones...
                              </SelectItem>
                            ) : timezones &&
                              Object.keys(timezones).length > 0 ? (
                              Object.entries(timezones).map(
                                ([group, options]) => (
                                  <SelectGroup key={group}>
                                    <SelectLabel>{group}</SelectLabel>
                                    {Array.isArray(options) &&
                                      options
                                        .filter(
                                          (option) =>
                                            option.value &&
                                            option.value.trim() !== ""
                                        )
                                        .map((option) => (
                                          <SelectItem
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                  </SelectGroup>
                                )
                              )
                            ) : (
                              <SelectItem value="no-timezones" disabled>
                                No timezones found.
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
