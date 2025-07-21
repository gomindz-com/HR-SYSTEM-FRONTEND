import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Ebrima Jallow",
    email: "ebrima.jallow@gomindz.gm",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });
  const [theme, setTheme] = useState("light");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and preferences
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <Button className="mt-2">Save Profile</Button>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-email">Email Notifications</Label>
              <Switch
                id="notif-email"
                checked={notifications.email}
                onCheckedChange={(v) =>
                  setNotifications((n) => ({ ...n, email: v }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notif-sms">SMS Notifications</Label>
              <Switch
                id="notif-sms"
                checked={notifications.sms}
                onCheckedChange={(v) =>
                  setNotifications((n) => ({ ...n, sms: v }))
                }
              />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card md:col-span-2">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
            <span className="text-muted-foreground">
              (Demo only, does not persist)
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
