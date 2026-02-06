
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import { BadgeAlert, BadgeCheck, BadgeInfo, MessageSquare, Clock } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Welcome to Feedback Hub
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            A simple and effective way to manage feedback across your organization
          </p>
          
          {isAuthenticated ? (
            <Button asChild size="lg">
              <Link to={isAdmin ? "/admin" : "/dashboard"}>
                Go to {isAdmin ? "Admin Dashboard" : "Your Dashboard"}
              </Link>
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/login">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Login
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/signup">
                  Sign Up to Get Started
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full">
                    <MessageSquare className="h-6 w-6 text-blue-700" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-center mb-2">Submit Feedback</h3>
                <p className="text-gray-600 text-center">
                  Choose an entity, select a category, provide details, and submit your feedback.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-700" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-center mb-2">Track Status</h3>
                <p className="text-gray-600 text-center">
                  Monitor the status of your feedback as it's reviewed and resolved by administrators.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full">
                    <BadgeCheck className="h-6 w-6 text-green-700" />
                  </div>
                </div>
                <h3 className="text-xl font-medium text-center mb-2">Get Responses</h3>
                <p className="text-gray-600 text-center">
                  Receive responses to your feedback directly through the platform or via email.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-20 bg-slate-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-8">Feedback Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <BadgeAlert className="h-10 w-10 text-feedback-complaint mb-4" />
              <h3 className="text-xl font-medium mb-2">Complaints</h3>
              <p className="text-center text-gray-600">
                Report issues or problems that need to be addressed
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <BadgeInfo className="h-10 w-10 text-feedback-suggestion mb-4" />
              <h3 className="text-xl font-medium mb-2">Suggestions</h3>
              <p className="text-center text-gray-600">
                Share ideas for improvements or new features
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <BadgeCheck className="h-10 w-10 text-feedback-compliment mb-4" />
              <h3 className="text-xl font-medium mb-2">Compliments</h3>
              <p className="text-center text-gray-600">
                Recognize excellent service or positive experiences
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
