
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminFeedbackItem from "./AdminFeedbackItem";
import { BadgeAlert, BadgeCheck, BadgeInfo } from "lucide-react";

const AdminFeedbackTabs = ({
  activeTab,
  setActiveTab,
  filteredFeedbacks,
  adminFeedbacks
}) => {
  
  const getCategoryCount = (category) => {
    return adminFeedbacks.filter((feedback) => feedback.category === category).length;
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
        <TabsTrigger value="resolved">Resolved</TabsTrigger>
        <TabsTrigger value="complaints">
          <BadgeAlert className="h-4 w-4 mr-1 text-feedback-complaint" />
          Complaints ({getCategoryCount("complaint")})
        </TabsTrigger>
        <TabsTrigger value="suggestions">
          <BadgeInfo className="h-4 w-4 mr-1 text-feedback-suggestion" />
          Suggestions ({getCategoryCount("suggestion")})
        </TabsTrigger>
        <TabsTrigger value="compliments">
          <BadgeCheck className="h-4 w-4 mr-1 text-feedback-compliment" />
          Compliments ({getCategoryCount("compliment")})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab}>
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Feedbacks
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredFeedbacks.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((feedback) => (
                  <AdminFeedbackItem key={feedback.id} feedback={feedback} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No feedbacks found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdminFeedbackTabs;
