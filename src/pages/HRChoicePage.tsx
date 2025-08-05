import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const HRChoicePage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  // Redirect if user is EMPLOYEE
  React.useEffect(() => {
    if (authUser && authUser.role === "EMPLOYEE") {
      navigate("/my-portal");
    }
  }, [authUser, navigate]);

  if (!authUser || authUser.role === "EMPLOYEE") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {authUser.name}!
          </h1>
          <p className="text-lg text-gray-600">
            Choose how you'd like to use the system today
          </p>
          <p className="text-sm text-gray-500 mt-2">Role: {authUser.role}</p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* HR Dashboard Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Management Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Access the full management system. Manage employees, view
                reports, handle payroll, and oversee company operations.
              </p>
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Go to Management Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Employee Portal Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Employee Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Use the employee interface to check in/out, view your
                attendance, and manage leave requests. Perfect for testing or
                personal use.
              </p>
              <Button
                onClick={() => navigate("/my-portal")}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                Go to Employee Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Remember Choice */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            You can switch between portals anytime using the navigation menu
          </p>
        </div>
      </div>
    </div>
  );
};

export default HRChoicePage;
