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

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPasswordPage = () => {
  const form = useForm<{ email: string }>({
    defaultValues: { email: "" },
    resolver: zodResolver(formSchema),
  });
  const { forgotPassword, forgotPasswordLoading } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    try {
      const success = await forgotPassword(data);
      if (success) {
        setSubmitted(true);
      }
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
                Forgot Password?
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Enter your email address and we'll send you a link to reset your
                password.
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className="h-12 text-base"
                          {...field}
                          disabled={forgotPasswordLoading || submitted}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={forgotPasswordLoading || submitted}
                >
                  {forgotPasswordLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending reset link...</span>
                    </div>
                  ) : (
                    "Send Reset Link"
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
              Password Reset Email Sent
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              If an account with that email exists, you will receive a password
              reset link shortly.
              <br />
              <br />
              Please check your inbox (and spam folder).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setSubmitted(false)}
              >
                Close
              </Button>
            </DialogClose>
            <a
              href="/login"
              className="block w-full sm:w-auto text-center px-4 py-2 text-sm font-medium text-primary hover:underline transition-colors"
            >
              Return to Login
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForgotPasswordPage;
