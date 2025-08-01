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
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { login, loggingIn } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const success = await login({
      email: data.email,
      password: data.password,
    });
    if (success) {
      // Let the route protection handle the redirect based on user role
      // The App.tsx routes will automatically redirect to the correct page
      navigate("/");
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
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Login to your HR Management System account
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
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-medium"
                  disabled={loggingIn}
                >
                  {loggingIn ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>

            {/* Links */}
            <div className="space-y-4 text-center">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <a
                    href="/company-signup"
                    className="font-medium text-primary hover:underline transition-colors"
                  >
                    Sign up
                  </a>
                </p>
                <p className="text-muted-foreground">
                  <a
                    href="/forgot-password"
                    className="font-medium text-primary hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative hidden lg:block bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
          <img
            src="/side1.jpg"
            alt="HR Management System"
            className="w-full h-full object-cover mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
