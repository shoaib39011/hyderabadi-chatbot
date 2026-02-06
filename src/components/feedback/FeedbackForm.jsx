
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useFeedback } from "@/context/FeedbackContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BadgeAlert, BadgeCheck, BadgeInfo } from "lucide-react";

const entities = [
  "IT Department",
  "HR Department",
  "Finance Department",
  "Marketing Department",
  "Operations Department",
  "Customer Service",
  "Research & Development",
  "Sales Department",
  "Executive Team",
  "Facilities Management"
];

const FeedbackForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const { addFeedback } = useFeedback();
  const { toast } = useToast();

  const [entity, setEntity] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit feedback",
        variant: "destructive",
      });
      return;
    }

    if (!entity || !category || !description || !contactEmail) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    addFeedback({
      userId: user.id,
      username: user.username,
      entity,
      company: user.company || "",
      category: category,
      description,
      contactEmail,
    });

    toast({
      title: "Success",
      description: "Your feedback has been submitted",
    });

    // Reset form
    setEntity("");
    setCategory("");
    setDescription("");

    // Call success callback
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="entity">Select Department/Entity</Label>
        <Select value={entity} onValueChange={setEntity}>
          <SelectTrigger id="entity">
            <SelectValue placeholder="Select department or entity" />
          </SelectTrigger>
          <SelectContent>
            {entities.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Feedback Type</Label>
        <RadioGroup
          value={category}
          onValueChange={(value) => setCategory(value)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-slate-50">
            <RadioGroupItem value="complaint" id="complaint" />
            <Label htmlFor="complaint" className="flex items-center cursor-pointer">
              <BadgeAlert className="h-4 w-4 mr-2 text-feedback-complaint" />
              Complaint
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-slate-50">
            <RadioGroupItem value="suggestion" id="suggestion" />
            <Label htmlFor="suggestion" className="flex items-center cursor-pointer">
              <BadgeInfo className="h-4 w-4 mr-2 text-feedback-suggestion" />
              Suggestion
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-slate-50">
            <RadioGroupItem value="compliment" id="compliment" />
            <Label htmlFor="compliment" className="flex items-center cursor-pointer">
              <BadgeCheck className="h-4 w-4 mr-2 text-feedback-compliment" />
              Compliment
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please describe your feedback in detail"
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Contact Email</Label>
        <Input
          id="contact"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="Your email address for response"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Feedback
      </Button>
    </form>
  );
};

export default FeedbackForm;
