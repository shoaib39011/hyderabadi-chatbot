
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeAlert, BadgeCheck, BadgeInfo, Calendar, Clock } from "lucide-react";

const FeedbackList = ({ feedbacks, showResponse = true }) => {

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "complaint":
        return <BadgeAlert className="h-4 w-4 text-feedback-complaint" />;
      case "suggestion":
        return <BadgeInfo className="h-4 w-4 text-feedback-suggestion" />;
      case "compliment":
        return <BadgeCheck className="h-4 w-4 text-feedback-compliment" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "complaint":
        return "text-feedback-complaint border-feedback-complaint";
      case "suggestion":
        return "text-feedback-suggestion border-feedback-suggestion";
      case "compliment":
        return "text-feedback-compliment border-feedback-compliment";
      default:
        return "text-gray-500 border-gray-500";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Reviewed</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (feedbacks.length === 0) {
    return <div className="text-center py-6 text-gray-500">No feedbacks found</div>;
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((feedback) => (
        <Card key={feedback.id} className="overflow-hidden">
          <div className={`h-2 ${feedback.category === "complaint" ? "bg-feedback-complaint" :
              feedback.category === "suggestion" ? "bg-feedback-suggestion" :
                feedback.category === "compliment" ? "bg-feedback-compliment" : "bg-gray-200"
            }`} />
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{feedback.entity}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <div className="flex items-center">
                    {getCategoryIcon(feedback.category)}
                    <span className={`ml-1 ${getCategoryColor(feedback.category)}`}>
                      {feedback.category.charAt(0).toUpperCase() + feedback.category.slice(1)}
                    </span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(feedback.createdAt)}
                  </div>
                </CardDescription>
              </div>
              {getStatusBadge(feedback.status)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{feedback.description}</p>
          </CardContent>
          {(showResponse && (feedback.status === "reviewed" || feedback.status === "resolved")) && (
            <CardFooter className="flex flex-col items-start bg-slate-50 border-t">
              <div className="w-full">
                <h4 className="text-sm font-medium mb-1">Admin Response:</h4>
                <p className="text-sm text-gray-600">{feedback.adminResponse || "No response yet"}</p>
                {feedback.resolvedAt && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Resolved on {formatDate(feedback.resolvedAt)}</span>
                  </div>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default FeedbackList;
