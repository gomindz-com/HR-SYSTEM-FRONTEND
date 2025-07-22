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
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useParams, useNavigate } from "react-router-dom";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const form = useForm<{ password: string; confirmPassword: string }>({
    defaultValues: { password: "", confirmPassword: "" },
    resolver: zodResolver(formSchema),
  });
  const { resetPassword, resetPasswordLoading } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    if (!token) return;
    try {
      await resetPassword({ ...data, token });
      setSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="w-full h-full grid lg:grid-cols-[70%_30%]">
        <div className="max-w-lg m-auto w-full flex flex-col items-start py-6">
          <p className="mt-4 text-xl font-extrabold tracking-tight text-start mb-4 font-serif text-primary">
            Reset your password
          </p>
          <p className="mb-6 text-muted-foreground text-sm">
            Enter your new password below.
          </p>
          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New Password"
                        className="w-full"
                        {...field}
                        disabled={resetPasswordLoading || submitted}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full"
                        {...field}
                        disabled={resetPasswordLoading || submitted}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={resetPasswordLoading || submitted}
              >
                {resetPasswordLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
          <div className="flex flex-row justify-between w-full">
            <p className="mt-5 text-sm text-center">
              Remembered your password?
              <a href="/login" className="ml-1 underline text-muted-foreground">
                Log in
              </a>
            </p>
          </div>
        </div>
        <div className="bg-muted hidden lg:block">
          <img
            src="/side3.jpg"
            alt="reset password"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Success Modal */}
      <Dialog open={submitted} onOpenChange={setSubmitted}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Reset Successful</DialogTitle>
            <DialogDescription>
              Your password has been reset. You can now log in with your new
              password.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="w-full mt-2"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResetPasswordPage;
