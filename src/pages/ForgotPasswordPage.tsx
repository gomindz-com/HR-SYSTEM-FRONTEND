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
    <div className="h-screen flex items-center justify-center ">
      <div className="w-full h-full grid lg:grid-cols-[70%_30%]">
        <div className="max-w-lg m-auto w-full flex flex-col items-start py-6">
          <p className="mt-4 text-xl font-extrabold tracking-tight text-start mb-4 font-serif text-primary">
            Forgot your password?
          </p>
          <p className="mb-6 text-muted-foreground text-sm">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="w-full"
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
                className="mt-4 w-full"
                disabled={forgotPasswordLoading || submitted}
              >
                {forgotPasswordLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Send Reset Link"
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
            alt="forgot password"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Success Modal */}
      <Dialog open={submitted} onOpenChange={setSubmitted}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Reset Email Sent</DialogTitle>
            <DialogDescription>
              If an account with that email exists, you will receive a password
              reset link shortly.
              <br />
              Please check your inbox (and spam folder).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="w-full mt-2"
                onClick={() => setSubmitted(false)}
              >
                Close
              </Button>
            </DialogClose>
            <a
              href="/login"
              className="block w-full text-center mt-2 underline text-primary"
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
