import { 
  Clock, 
  UserPlus, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    type: "leave_request",
    title: "Leave Request Submitted",
    description: "Sarah Johnson requested 3 days vacation leave",
    time: "2 hours ago",
    icon: Calendar,
    status: "pending",
  },
  {
    id: 2,
    type: "new_hire",
    title: "New Employee Onboarded",
    description: "Michael Chen joined the Engineering team",
    time: "4 hours ago",
    icon: UserPlus,
    status: "completed",
  },
  {
    id: 3,
    type: "performance",
    title: "Performance Review Due",
    description: "Q4 reviews need completion for 5 employees",
    time: "6 hours ago",
    icon: TrendingUp,
    status: "urgent",
  },
  {
    id: 4,
    type: "attendance",
    title: "Late Check-in Alert",
    description: "3 employees checked in after 9:30 AM",
    time: "1 day ago",
    icon: Clock,
    status: "warning",
  },
  {
    id: 5,
    type: "leave_approved",
    title: "Leave Request Approved",
    description: "Emma Wilson's sick leave has been approved",
    time: "1 day ago",
    icon: CheckCircle,
    status: "completed",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "urgent":
      return "destructive";
    case "warning":
      return "warning";
    default:
      return "secondary";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    case "urgent":
      return "Urgent";
    case "warning":
      return "Warning";
    default:
      return "Info";
  }
};

export function RecentActivity() {
  return (
    <Card className="shadow-card bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Latest updates and actions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <IconComponent className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium text-sm text-foreground">
                      {activity.title}
                    </h4>
                    <Badge 
                      variant={getStatusColor(activity.status) as any}
                      className="text-xs shrink-0"
                    >
                      {getStatusText(activity.status)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-sm text-primary hover:text-primary-hover font-medium transition-colors">
            View all activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}