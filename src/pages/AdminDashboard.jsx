
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFeedback } from "@/context/FeedbackContext";
import Layout from "@/components/layout/Layout";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";
import AdminStatCards from "@/components/admin/AdminStatCards";
import AdminFeedbackTabs from "@/components/admin/AdminFeedbackTabs";

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { feedbacks, getCompanyFeedbacks, getAllFeedbacks } = useFeedback();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  
  // Redirect if not authenticated or not an admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  // Central admin sees all feedbacks, filtered by selected company if applicable
  const adminFeedbacks = selectedCompany && selectedCompany !== "all" 
    ? getCompanyFeedbacks(selectedCompany) 
    : getAllFeedbacks();
  
  // Get unique companies for filtering
  const companies = Array.from(new Set(feedbacks.map(f => f.company))).sort();
  
  // Filter feedbacks based on active tab and search term
  const filteredFeedbacks = adminFeedbacks
    .filter((feedback) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return feedback.status === "pending";
      if (activeTab === "reviewed") return feedback.status === "reviewed";
      if (activeTab === "resolved") return feedback.status === "resolved";
      if (activeTab === "complaints") return feedback.category === "complaint";
      if (activeTab === "suggestions") return feedback.category === "suggestion";
      if (activeTab === "compliments") return feedback.category === "compliment";
      return true;
    })
    .filter((feedback) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        feedback.entity.toLowerCase().includes(searchLower) ||
        feedback.description.toLowerCase().includes(searchLower) ||
        feedback.contactEmail.toLowerCase().includes(searchLower) ||
        feedback.username.toLowerCase().includes(searchLower) ||
        feedback.company.toLowerCase().includes(searchLower)
      );
    });

  return (
    <Layout>
      <div className="space-y-6">
        <AdminDashboardHeader
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          companies={companies}
        />
        
        <AdminStatCards adminFeedbacks={adminFeedbacks} />
        
        <AdminFeedbackTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredFeedbacks={filteredFeedbacks}
          adminFeedbacks={adminFeedbacks}
        />
      </div>
    </Layout>
  );
};

export default AdminDashboard;
