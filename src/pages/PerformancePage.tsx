import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp, Search, Plus, Star, Target } from "lucide-react";

const mockReviews = [
  {
    id: 1,
    employeeName: "Ebrima Jallow",
    reviewer: "Fatou Camara",
    reviewPeriod: "Q2 2024",
    overallScore: 4.5,
    goals: 6,
    completedGoals: 6,
    status: "Completed",
    reviewDate: "2024-06-01",
    comments: "Excellent coding skills and team player.",
  },
  {
    id: 2,
    employeeName: "Fatou Camara",
    reviewer: "Awa Ceesay",
    reviewPeriod: "Q2 2024",
    overallScore: 4.7,
    goals: 5,
    completedGoals: 5,
    status: "Completed",
    reviewDate: "2024-06-02",
    comments: "Strong leadership in product management.",
  },
  {
    id: 3,
    employeeName: "Lamin Sanyang",
    reviewer: "Isatou Touray",
    reviewPeriod: "Q2 2024",
    overallScore: 3.8,
    goals: 5,
    completedGoals: 4,
    status: "In Progress",
    reviewDate: "2024-06-10",
    comments: "Creative designs, needs to improve deadlines.",
  },
  {
    id: 4,
    employeeName: "Awa Ceesay",
    reviewer: "Modou Bah",
    reviewPeriod: "Q2 2024",
    overallScore: 4.2,
    goals: 4,
    completedGoals: 4,
    status: "Completed",
    reviewDate: "2024-06-03",
    comments: "Great HR support and communication.",
  },
  {
    id: 5,
    employeeName: "Modou Bah",
    reviewer: "Fatoumatta Danso",
    reviewPeriod: "Q2 2024",
    overallScore: 4.0,
    goals: 5,
    completedGoals: 5,
    status: "Completed",
    reviewDate: "2024-06-04",
    comments: "Effective sales strategies and results.",
  },
  {
    id: 6,
    employeeName: "Isatou Touray",
    reviewer: "Ndey Samba",
    reviewPeriod: "Q2 2024",
    overallScore: 4.3,
    goals: 5,
    completedGoals: 5,
    status: "Completed",
    reviewDate: "2024-06-05",
    comments: "Excellent marketing campaigns.",
  },
  {
    id: 7,
    employeeName: "Fatoumatta Danso",
    reviewer: "Ebrima Jallow",
    reviewPeriod: "Q2 2024",
    overallScore: 4.8,
    goals: 6,
    completedGoals: 6,
    status: "Completed",
    reviewDate: "2024-06-06",
    comments: "Outstanding AI leadership and innovation.",
  },
  {
    id: 8,
    employeeName: "Ndey Samba",
    reviewer: "Fatou Camara",
    reviewPeriod: "Q2 2024",
    overallScore: 4.6,
    goals: 5,
    completedGoals: 5,
    status: "Completed",
    reviewDate: "2024-06-07",
    comments: "Excellent business development and partnerships.",
  },
];

const PerformancePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviews, setReviews] = useState(mockReviews);
  const [showAddReview, setShowAddReview] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      review.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "In Progress":
        return "bg-warning/10 text-warning";
      case "Pending":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted/10 text-muted-foreground";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-success";
    if (score >= 3.5) return "text-warning";
    return "text-destructive";
  };

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(score)
            ? "fill-warning text-warning"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  const avgScore =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.overallScore, 0) /
        reviews.length
      : 0;
  const completedReviews = reviews.filter(
    (r) => r.status === "Completed"
  ).length;
  const pendingReviews = reviews.filter(
    (r) => r.status === "Pending" || r.status === "In Progress"
  ).length;
  const totalGoals = reviews.reduce((sum, r) => sum + r.goals, 0);
  const completedGoals = reviews.reduce((sum, r) => sum + r.completedGoals, 0);
  const goalsCompletion =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">
          Performance Management
        </h1>
        <p className="text-muted-foreground">
          Manage employee reviews and performance tracking
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
              {avgScore.toFixed(1)}
            </div>
            <div className="flex items-center mt-1">
              {renderStars(avgScore)}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {completedReviews}
            </div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending/In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {pendingReviews}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Goals Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {goalsCompletion}%
            </div>
            <p className="text-xs text-muted-foreground">Average rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Performance Review</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="employee">Employee</Label>
                <Input id="employee" placeholder="Employee name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reviewer">Reviewer</Label>
                <Input id="reviewer" placeholder="Reviewer name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="score">Overall Score (1-5)</Label>
                <Input id="score" type="number" min="1" max="5" step="0.1" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comments">Comments</Label>
                <Textarea id="comments" placeholder="Review comments..." />
              </div>
              <Button>Save Review</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Performance Reviews Table */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Review Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    {review.employeeName}
                  </TableCell>
                  <TableCell>{review.reviewer}</TableCell>
                  <TableCell>{review.reviewPeriod}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${getScoreColor(
                          review.overallScore
                        )}`}
                      >
                        {review.overallScore}
                      </span>
                      <div className="flex">
                        {renderStars(review.overallScore)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {review.completedGoals}/{review.goals}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(review.status)}>
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedReview(review);
                        setViewDialogOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Review View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Performance Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="grid gap-2 py-2">
              <div>
                <strong>Employee:</strong> {selectedReview.employeeName}
              </div>
              <div>
                <strong>Reviewer:</strong> {selectedReview.reviewer}
              </div>
              <div>
                <strong>Period:</strong> {selectedReview.reviewPeriod}
              </div>
              <div>
                <strong>Score:</strong> {selectedReview.overallScore}
              </div>
              <div>
                <strong>Goals:</strong> {selectedReview.completedGoals} /{" "}
                {selectedReview.goals}
              </div>
              <div>
                <strong>Status:</strong> {selectedReview.status}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(selectedReview.reviewDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Comments:</strong> {selectedReview.comments}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PerformancePage;
