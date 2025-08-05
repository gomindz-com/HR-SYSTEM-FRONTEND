import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, AlertCircle, CheckCircle, Info } from "lucide-react";
import { useCompanyStore } from "../../../store/useCompanyStore";
import { useAuthStore } from "../../../store/useAuthStore";

// Zod schema for form validation
const companySettingsSchema = z
  .object({
    workStartTime: z
      .string()
      .min(1, "Work start time is required")
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)")
      .refine((time) => {
        if (!time) return false;
        const [hours, minutes] = time.split(":").map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, "Invalid time value"),
    workEndTime: z
      .string()
      .min(1, "Work end time is required")
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)")
      .refine((time) => {
        if (!time) return false;
        const [hours, minutes] = time.split(":").map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, "Invalid time value"),
    lateThreshold: z
      .number()
      .min(0, "Must be at least 0 minutes")
      .max(120, "Must be between 0 and 120 minutes"),
    checkInDeadline: z
      .number()
      .min(0, "Must be at least 0 minutes")
      .max(120, "Must be between 0 and 120 minutes"),
  })
  .refine(
    (data) => {
      // Ensure work end time is after work start time
      if (data.workStartTime && data.workEndTime) {
        const startTime = new Date(`2000-01-01T${data.workStartTime}:00`);
        const endTime = new Date(`2000-01-01T${data.workEndTime}:00`);
        return endTime > startTime;
      }
      return true;
    },
    {
      message: "Work end time must be after work start time",
      path: ["workEndTime"],
    }
  );

type CompanySettingsFormData = z.infer<typeof companySettingsSchema>;

// Generate time slots from 6 AM to 11 PM in 30-minute intervals
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const displayMinute = minute.toString().padStart(2, "0");
      const displayTime = `${displayHour}:${displayMinute} ${period}`;
      const valueTime = `${hour.toString().padStart(2, "0")}:${displayMinute}`;
      slots.push({ display: displayTime, value: valueTime });
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export default function CompanySettingsTab() {
  const {
    settings,
    isLoading,
    isUpdating,
    timezones,
    isLoadingTimezones,
    fetchSettings,
    updateSettings,
    fetchTimezones,
  } = useCompanyStore();
  const { authUser } = useAuthStore();

  const form = useForm<CompanySettingsFormData>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      workStartTime: "09:00",
      workEndTime: "17:00",
      lateThreshold: 15,
      checkInDeadline: 15,
    },
  });

  // Load settings when component mounts
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      form.reset({
        workStartTime: settings.workStartTime || "09:00",
        workEndTime: settings.workEndTime || "17:00",
        lateThreshold: settings.lateThreshold || 15,
        checkInDeadline: settings.checkInDeadline || 15,
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: CompanySettingsFormData) => {
    try {
      await updateSettings(data);
    } catch (error) {
      console.error("Settings update failed:", error);
    }
  };

  // Check if user has permission to edit company settings
  const canEditSettings =
    authUser?.role === "HR" ||
    authUser?.role === "CEO" ||
    authUser?.role === "CTO" ||
    authUser?.role === "DIRECTOR";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">
          Loading company settings...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Company Settings
          </h2>
          <p className="text-muted-foreground">
            Configure attendance rules and timezone settings
          </p>
        </div>
        {!canEditSettings && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">
              Only HR and management can edit these settings
            </span>
          </div>
        )}
      </div>

      {/* Current Settings Info */}
      {settings && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Current Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <Label className="text-blue-700 font-medium">Company</Label>
                <p className="text-blue-900">{settings.companyName}</p>
              </div>
              <div>
                <Label className="text-blue-700 font-medium">Timezone</Label>
                <p className="text-blue-900">UTC (Universal Time)</p>
                <p className="text-blue-600 text-xs">
                  All times are stored in UTC for universal compatibility
                </p>
              </div>
              <div>
                <Label className="text-blue-700 font-medium">Work Hours</Label>
                <p className="text-blue-900">
                  {settings.workStartTime} - {settings.workEndTime}
                </p>
              </div>
              <div>
                <Label className="text-blue-700 font-medium">
                  Late Threshold
                </Label>
                <p className="text-blue-900">
                  {settings.lateThreshold} minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Form */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Attendance Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {/* Work Start Time */}
                 <FormField
                   control={form.control}
                   name="workStartTime"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel className="text-sm font-medium text-gray-700">
                         Work Start Time
                       </FormLabel>
                       <Select
                         onValueChange={field.onChange}
                         value={field.value}
                         disabled={!canEditSettings}
                       >
                         <FormControl>
                           <SelectTrigger>
                             <Clock className="mr-2 h-4 w-4" />
                             <SelectValue placeholder="Select start time" />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           {timeSlots.map((time) => (
                             <SelectItem key={time.value} value={time.value}>
                               {time.display}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                       <FormDescription className="text-xs">
                         Employees can check in from this time.
                       </FormDescription>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                                 {/* Work End Time */}
                 <FormField
                   control={form.control}
                   name="workEndTime"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel className="text-sm font-medium text-gray-700">
                         Work End Time
                       </FormLabel>
                       <Select
                         onValueChange={field.onChange}
                         value={field.value}
                         disabled={!canEditSettings}
                       >
                         <FormControl>
                           <SelectTrigger>
                             <Clock className="mr-2 h-4 w-4" />
                             <SelectValue placeholder="Select end time" />
                           </SelectTrigger>
                         </FormControl>
                         <SelectContent>
                           {timeSlots.map((time) => (
                             <SelectItem key={time.value} value={time.value}>
                               {time.display}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                       <FormDescription className="text-xs">
                         Standard work day ends at this time.
                       </FormDescription>
                       <FormMessage />
                     </FormItem>
                   )}
                 />

                {/* Late Threshold */}
                <FormField
                  control={form.control}
                  name="lateThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Late Threshold (minutes)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15"
                          min="0"
                          max="120"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              // Don't allow empty values
                              return;
                            }
                            const numValue = parseInt(value);
                            if (
                              !isNaN(numValue) &&
                              numValue >= 0 &&
                              numValue <= 120
                            ) {
                              field.onChange(numValue);
                            }
                          }}
                          disabled={!canEditSettings}
                          required
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Minutes after work start time to mark as late.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Check-in Deadline */}
                <FormField
                  control={form.control}
                  name="checkInDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Check-in Grace Period (minutes)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15"
                          min="0"
                          max="120"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                              // Don't allow empty values
                              return;
                            }
                            const numValue = parseInt(value);
                            if (
                              !isNaN(numValue) &&
                              numValue >= 0 &&
                              numValue <= 120
                            ) {
                              field.onChange(numValue);
                            }
                          }}
                          disabled={!canEditSettings}
                          required
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Minutes after work end time to allow check-ins.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Submit Button */}
              {canEditSettings && (
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isUpdating}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isUpdating ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Help Information */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-700 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Check-in Rules:
              </h4>
              <ul className="space-y-1">
                <li>• Employees can check in from work start time</li>
                <li>• Check-ins after late threshold are marked as "Late"</li>
                <li>• Check-ins are allowed until grace period ends</li>
                <li>
                  • All times are stored in UTC for universal compatibility
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Example:</h4>
              <ul className="space-y-1">
                <li>• Work: 9:00 AM - 5:00 PM</li>
                <li>• Late threshold: 15 minutes</li>
                <li>• Grace period: 15 minutes</li>
                <li>• Check-in deadline: 5:15 PM</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
