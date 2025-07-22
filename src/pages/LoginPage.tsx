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
      navigate("/dashboard");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="w-full h-full grid lg:grid-cols-[70%_30%]">
      <div className="max-w-lg m-auto w-full flex flex-col items-start py-6">
          <p className="mt-4 text-xl font-extrabold tracking-tight text-start mb-4 font-serif text-primary">
            Sign up for HR Management System
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={loggingIn}
              >
                {loggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
         <div className="flex flex-row justify-between w-full">
         <p className="mt-5 text-sm text-center">
            Don't have an account?
            <a
              href="/company-signup"
              className="ml-1 underline text-muted-foreground"
            >
              Sign up
            </a>
          </p>
          <p className="mt-5 text-sm text-center">
            Forgot password?
            <a
              href="/forgot-password"
              className="ml-1 underline text-muted-foreground"
            >
              Reset password
            </a>
          </p>


         </div>
        </div>
        <div className="bg-muted hidden lg:block">
          <img
            src="/side1.jpg"
            alt="login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
