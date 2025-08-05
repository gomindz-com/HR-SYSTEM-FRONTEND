import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useUserStore } from "../../../store/useUserStore";
import { useAuthStore } from "../../../store/useAuthStore";

// Zod schema for form validation
const profileSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.date().optional(),
  emergencyContact: z.string().optional(),
  profilePic: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSettingsTab() {
  const [isUpdatingPicture, setIsUpdatingPicture] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isUpdating, updateUserProfile } = useUserStore();
  const { authUser, checkAuth } = useAuthStore();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: authUser?.name || "",
      email: authUser?.email || "",
      phone: authUser?.phone || "",
      position: authUser?.position || "",
      address: authUser?.address || "",
      dateOfBirth: authUser?.dateOfBirth
        ? new Date(authUser.dateOfBirth)
        : undefined,
      emergencyContact: authUser?.emergencyContact || "",
      profilePic: null,
    },
  });

  // Load user data when component mounts
  useEffect(() => {
    if (!authUser) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      form.reset({
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        position: authUser.position || "",
        address: authUser.address || "",
        dateOfBirth: authUser.dateOfBirth
          ? new Date(authUser.dateOfBirth)
          : undefined,
        emergencyContact: authUser.emergencyContact || "",
        profilePic: null,
      });
    }
  }, [authUser, form]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      form.setValue("profilePic", file);
      form.clearErrors("profilePic");
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateUserProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        address: data.address,
        dateOfBirth: data.dateOfBirth
          ? data.dateOfBirth.toISOString()
          : undefined,
        emergencyContact: data.emergencyContact,
        profilePic: data.profilePic,
      });

      // Clear preview after successful update
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
      }

      await checkAuth();
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Profile Settings</h2>
        <p className="text-muted-foreground">
          Update your personal information and profile picture
        </p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Picture Section */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-gray-100">
                      <AvatarImage
                        src={avatarPreview || authUser?.profilePic}
                        alt="Profile picture"
                      />
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-lg sm:text-xl font-semibold">
                        <User className="h-8 w-8 sm:h-10 sm:w-10" />
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute -bottom-1 -right-1 rounded-full bg-white border border-gray-200 w-8 h-8 sm:w-10 sm:h-10 shadow-md transition-all"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    Click the camera icon to change your avatar
                  </p>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                    Profile Picture
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Upload a new profile picture to personalize your account
                  </p>
                </div>
              </div>

              <Separator />

              {/* Form Fields - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Your official contact email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Position
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your position" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Your current job title or position.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        For urgent communications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your address" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Your current residential address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Emergency Contact
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter emergency contact"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Contact person for emergencies.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Date of Birth
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="text-xs sm:text-sm">
                        Your date of birth for records.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6 border-t border-gray-100">
                <div className="flex flex-col-reverse sm:flex-row justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    className="w-full sm:w-auto hover:bg-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 sm:px-8 w-full sm:w-auto"
                    disabled={form.formState.isSubmitting || isUpdating}
                  >
                    {form.formState.isSubmitting || isUpdating
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
