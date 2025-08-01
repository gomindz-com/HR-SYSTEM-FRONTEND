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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-[60%_40%] xl:grid-cols-[65%_35%] bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Form Section */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                Reset Password
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Enter your new password below.
              </p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          className="h-12 text-base"
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
                      <FormLabel className="text-sm font-medium">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your new password"
                          className="h-12 text-base"
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
                  className="w-full h-12 text-base font-medium"
                  disabled={resetPasswordLoading || submitted}
                >
                  {resetPasswordLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Resetting password...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>

            {/* Back to Login */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Remembered your password?{" "}
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
            src="/side3.jpg"
            alt="Password Reset"
            className="w-full h-full object-cover mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={submitted} onOpenChange={setSubmitted}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Password Reset Successful
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Your password has been reset successfully. You can now log in with
              your new password.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="w-full" onClick={() => navigate("/login")}>
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
