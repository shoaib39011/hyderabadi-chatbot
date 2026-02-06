
import { useState } from "react";
import { useFeedback } from "@/context/FeedbackContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BadgeAlert, BadgeCheck, BadgeInfo, Calendar, Clock, Mail, User, Building, Forward } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminFeedbackItem = ({ feedback }) => {
    const { updateFeedbackStatus } = useFeedback();
    const { getCompanyEmail } = useAuth();
    const { toast } = useToast();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [response, setResponse] = useState(feedback.adminResponse || "");
    const [newStatus, setNewStatus] = useState("reviewed");

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleSubmitResponse = () => {
        updateFeedbackStatus(feedback.id, newStatus, response);
        toast({
            title: "Success",
            description: `Feedback marked as ${newStatus}`,
        });
        setDialogOpen(false);
    };

    const handleForwardToCompany = () => {
        const companyEmail = getCompanyEmail(feedback.company);

        // In a real app, this would send an email
        // For demo purposes, we'll just show a toast notification
        toast({
            title: "Forwarded to Company",
            description: `Feedback forwarded to ${feedback.company} (${companyEmail})`,
        });

        // Mark as reviewed
        updateFeedbackStatus(
            feedback.id,
            "reviewed",
            `Forwarded to company on ${new Date().toLocaleDateString()}`
        );
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case "complaint":
                return "bg-feedback-complaint";
            case "suggestion":
                return "bg-feedback-suggestion";
            case "compliment":
                return "bg-feedback-compliment";
            default:
                return "bg-gray-200";
        }
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

    const companyEmail = getCompanyEmail(feedback.company);

    return (
        <Card className="overflow-hidden">
            <div className={`h-2 ${getCategoryColor(feedback.category)}`} />
            <CardHeader className="relative flex flex-row justify-between items-center p-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{feedback.entity}</h3>
                        {getStatusBadge(feedback.status)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1 flex-wrap gap-y-1">
                        <div className="flex items-center">
                            {getCategoryIcon(feedback.category)}
                            <span className="ml-1 capitalize">{feedback.category}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            <span className="font-medium text-blue-600">{feedback.company}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>{feedback.username}</span>
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(feedback.createdAt)}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="bg-slate-50 p-3 rounded-md">
                    <p className="text-gray-700">{feedback.description}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-1 text-gray-500" />
                        <a href={`mailto:${feedback.contactEmail}`} className="text-blue-600 hover:underline">
                            {feedback.contactEmail}
                        </a>
                    </div>
                    <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-1 text-gray-500" />
                        <a href={`mailto:${companyEmail}`} className="text-blue-600 hover:underline">
                            {companyEmail}
                        </a>
                    </div>
                </div>
                {feedback.adminResponse && (
                    <div className="mt-4 border-t pt-3">
                        <h4 className="text-sm font-medium mb-1">Response:</h4>
                        <p className="text-sm text-gray-600">{feedback.adminResponse}</p>
                        {feedback.resolvedAt && (
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Resolved on {formatDate(feedback.resolvedAt)}</span>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    className="flex-1 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    onClick={handleForwardToCompany}
                >
                    <Forward className="h-4 w-4 mr-1" /> Forward to Company
                </Button>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex-1">
                            {feedback.status === "pending" ? "Respond" : "Update Response"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Respond to Feedback</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Response</label>
                                <Textarea
                                    placeholder="Enter your response to the feedback"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                    rows={5}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Set Status</label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={newStatus === "reviewed" ? "default" : "outline"}
                                        onClick={() => setNewStatus("reviewed")}
                                    >
                                        Mark as Reviewed
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={newStatus === "resolved" ? "default" : "outline"}
                                        onClick={() => setNewStatus("resolved")}
                                    >
                                        Mark as Resolved
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitResponse}>Submit Response</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
};

export default AdminFeedbackItem;
