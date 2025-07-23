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
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const AcceptInvitationPage = () => {
  const form = useForm<{
    name: string;
    password: string;
    confirmPassword: string;
  }>({
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(formSchema),
  });
  const { acceptInvitation, acceptingInvitation, fetchDepartments } =
    useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!token) return;
    try {
      const success = await acceptInvitation({
        token,
        password: data.password,
        name: data.name,
      });
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
            Accept Your Invitation
          </p>
          <p className="mb-6 text-muted-foreground text-sm">
            Set your name and password to activate your account.
          </p>
          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Full Name" {...field} />
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
                        {...field}
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
                disabled={acceptingInvitation || submitted}
              >
                {acceptingInvitation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Accept Invitation"
                )}
              </Button>
            </form>
          </Form>
        </div>
        <div className="bg-muted hidden lg:block">
          <img
            src="/side3.jpg"
            alt="accept invitation"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Success Modal */}
      <Dialog open={submitted} onOpenChange={setSubmitted}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Created!</DialogTitle>
            <DialogDescription>
              Your account has been created. You can now log in.
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

export default AcceptInvitationPage;
