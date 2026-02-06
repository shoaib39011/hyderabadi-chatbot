
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeInfo, BadgeAlert, BadgeCheck } from "lucide-react";

const AdminStatCards = ({ adminFeedbacks }) => {
  const getStatusCount = (status) => {
    return adminFeedbacks.filter((feedback) => feedback.status === status).length;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Feedbacks</p>
              <h3 className="text-3xl font-bold">{adminFeedbacks.length}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BadgeInfo className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <h3 className="text-3xl font-bold">{getStatusCount("pending")}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <BadgeAlert className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <h3 className="text-3xl font-bold">{getStatusCount("resolved")}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BadgeCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatCards;
