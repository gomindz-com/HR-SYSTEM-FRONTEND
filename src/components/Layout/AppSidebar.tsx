import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  TrendingUp,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  Building,
  ChevronDown,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "../../../store/useAuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const mainNavigation = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Employee Directory", url: "/employees", icon: Users },
  { title: "Attendance", url: "/attendance", icon: Clock },
  { title: "Leave Management", url: "/leave", icon: Calendar },
  { title: "Performance", url: "/performance", icon: TrendingUp },
  { title: "Payroll", url: "/payroll", icon: CreditCard },
];

const analyticsNavigation = [
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
];

const systemNavigation = [
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

const hrNavigation = [
  { title: "Switch Portal", url: "/hr-choice", icon: Building },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const { authUser } = useAuthStore();

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses =
      "w-full justify-start transition-all duration-200 hover:bg-sidebar-accent/80";
    return isActive(path)
      ? `${baseClasses} bg-sidebar-accent text-sidebar-primary font-medium`
      : `${baseClasses} text-sidebar-foreground hover:text-sidebar-primary`;
  };

  return (
    <Sidebar
      className={`border-r transition-all duration-300 ${
        collapsed ? "w-14" : "w-64"
      } bg-sidebar`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <img
              src="/gomind.png"
              alt="Gomindz"
              className="w-full h-full object-"
            />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground font-mono">
                Gomindz
              </h1>
              <p className="text-xs  font-medium text-blue-500">HR System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider mb-2">
            {!collapsed && "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider mb-2">
            {!collapsed && "Analytics"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider mb-2">
            {!collapsed && "System"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* HR Portal Navigation - Only for HR users */}
        {authUser?.role === "HR" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-semibold uppercase tracking-wider mb-2">
              {!collapsed && "HR Tools"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {hrNavigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavClasses(item.url)}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!collapsed && (
                          <span className="ml-3">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Profile Section */}
        <div className="mt-auto p-2 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors">
            <Avatar className="rounded-full w-8 h-8 overflow-hidden">
              <AvatarImage
                src={authUser?.profilePic || ""}
                className="rounded-full object-cover"
                alt={authUser?.name || "User"}
              />
              <AvatarFallback className="rounded-full bg-purple-100 text-purple-600 text-xs font-semibold">
                {authUser?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {authUser?.name || "User Name"}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {authUser?.email || "User Email"}
                </p>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
