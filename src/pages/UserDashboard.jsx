
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFeedback } from "@/context/FeedbackContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackList from "@/components/feedback/FeedbackList";
import { Building } from "lucide-react";

const UserDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const { getUserFeedbacks } = useFeedback();
  const [activeTab, setActiveTab] = useState("submit");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const userFeedbacks = user ? getUserFeedbacks(user.id) : [];
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          {user?.company && (
            <div className="flex items-center mt-2 text-gray-600">
              <Building className="h-4 w-4 mr-1" />
              <span>{user.company}</span>
            </div>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="submit" className="flex-1">Submit Feedback</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Your Feedbacks ({userFeedbacks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Feedback</CardTitle>
                <CardDescription>
                  Please provide details about your feedback below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeedbackForm onSuccess={() => setActiveTab("history")} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Your Feedback History</CardTitle>
                <CardDescription>
                  Track the status of your submitted feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FeedbackList feedbacks={userFeedbacks} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserDashboard;
