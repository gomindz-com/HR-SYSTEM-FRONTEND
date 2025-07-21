import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notifications = [
  {
    type: "Leave Request",
    message: "Ebrima Jallow requested vacation leave.",
    time: "2 hours ago",
  },
  {
    type: "Attendance",
    message: "Lamin Sanyang was absent today.",
    time: "4 hours ago",
  },
  {
    type: "Review",
    message: "Performance review completed for Fatoumatta Danso.",
    time: "1 day ago",
  },
  {
    type: "Leave Approved",
    message: "Ndey Samba's business trip leave approved.",
    time: "2 days ago",
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">
          Recent HR notifications for GoMindz
        </p>
      </div>
      <div className="space-y-4">
        {notifications.map((n, i) => (
          <Card key={i} className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle>{n.type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-foreground mb-1">{n.message}</div>
              <div className="text-xs text-muted-foreground">{n.time}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
