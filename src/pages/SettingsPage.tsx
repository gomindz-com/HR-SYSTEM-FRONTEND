import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Building } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import ProfileSettingsTab from "../components/Settings/ProfileSettingsTab";
import CompanySettingsTab from "../components/Settings/CompanySettingsTab";

export default function SettingsPage() {
  const { authUser } = useAuthStore();

  // Check if user has permission to access company settings
  const canAccessCompanySettings =
    authUser?.role === "HR" ||
    authUser?.role === "CEO" ||
    authUser?.role === "CTO" ||
    authUser?.role === "DIRECTOR";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and company preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="company"
            className="flex items-center gap-2"
            disabled={!canAccessCompanySettings}
          >
            <Building className="h-4 w-4" />
            Company
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileSettingsTab />
        </TabsContent>

        <TabsContent value="company" className="mt-6">
          {canAccessCompanySettings ? (
            <CompanySettingsTab />
          ) : (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-amber-800">
                  <Settings className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium">Access Restricted</h3>
                    <p className="text-sm text-amber-700">
                      Only HR and management can access company settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
