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
    <div className="h-screen flex items-center justify-center ">
      <div className="w-full h-full grid lg:grid-cols-[70%_30%]">
        <div className="max-w-xl m-auto w-full flex flex-col items-start py-6">
          <p className="mt-4 text-xl font-extrabold tracking-tight text-start mb-4 font-serif text-primary">
            Sign up for HR Management System
          </p>
          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Company Name"
                          className="w-full"
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
                      <FormLabel>Company Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Company Email"
                          className="w-full"
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
                      <FormLabel>Company TIN</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Company TIN"
                          className="w-full"
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
                      <FormLabel>Company Address</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Company Address"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Company Description"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="HRName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HR Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="HR Name"
                          className="w-full"
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
                      <FormLabel>HR Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="HR Phone"
                          className="w-full"
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
                    <FormItem>
                      <FormLabel>HR Address</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="HR Address"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="HREmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HR Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="HR Email"
                          className="w-full"
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
                      <FormLabel>HR Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="HR Password"
                          className="w-full"
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
                      <FormLabel>Confirm HR Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm HR Password"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="mt-4 w-full bg-primary text-white"
                disabled={signingUp}
              >
                {signingUp ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <p className="mt-5 text-sm text-center">
            Already have an account?
            <a href="/login" className="ml-1 underline text-muted-foreground">
              Log in
            </a>
          </p>
        </div>
        <div className="bg-muted hidden lg:block">
          <img
            src="/side.jpg"
            alt="company signup"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;
