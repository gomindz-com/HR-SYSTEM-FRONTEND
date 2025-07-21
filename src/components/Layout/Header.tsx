import { Bell, Search, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="p-2 hover:bg-muted rounded-md transition-colors" />

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search employees, departments..."
            className="pl-10 bg-muted/50 border-0 focus:bg-card focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Stats */}
        <div className="hidden md:flex items-center gap-4 mr-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">142</p>
            <p className="text-xs text-muted-foreground">Total Employees</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">98%</p>
            <p className="text-xs text-muted-foreground">Attendance Rate</p>
          </div>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                You have 3 pending items
              </p>
            </div>
            <DropdownMenuItem className="p-3 hover:bg-muted/50">
              <div>
                <p className="font-medium">Role Update</p>
                <p className="text-sm text-muted-foreground">
                  Fatoumatta Danso has been assigned as AI Lead
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  2 hours ago
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 hover:bg-muted/50">
              <div>
                <p className="font-medium">Role Update</p>
                <p className="text-sm text-muted-foreground">
                  Ndey Samba has been assigned as Business Development Lead
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  4 hours ago
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-3 hover:bg-muted/50">
              <div>
                <p className="font-medium">Payroll Reminder</p>
                <p className="text-sm text-muted-foreground">
                  Payroll processing for GoMindz starts tomorrow
                </p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3 text-center text-primary hover:bg-primary/10">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Sun className="w-4 h-4 mr-2" />
              Light Mode
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Moon className="w-4 h-4 mr-2" />
              Dark Mode
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">JD</span>
          </div>
          <div className="hidden sm:block text-">
            <p className="text-sm font-medium">Victoria Mendy</p>
            <p className="text-xs text-muted-foreground">HR Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}
