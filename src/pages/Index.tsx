
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OutstandingReportDashboard } from "@/components/OutstandingReportDashboard";
import { DetailedEmployeePaymentReport } from "@/components/DetailedEmployeePaymentReport";
import { AdminDataEntryModal } from "@/components/AdminDataEntryModal";
import { LoginPage } from "@/components/LoginPage";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsModalOpen(false);
  };

  const handleLogin = () => {
    // This will be handled by the auth state change
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">Cash Management System</p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Insert Employee Data
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-gray-600 border-gray-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="outstanding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white rounded-lg shadow-sm p-1 border">
            <TabsTrigger 
              value="outstanding" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md py-3 text-base font-medium transition-all duration-200"
            >
              Outstanding Report
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md py-3 text-base font-medium transition-all duration-200"
            >
              Employee Payment Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="outstanding">
            <OutstandingReportDashboard key={refreshTrigger} />
          </TabsContent>

          <TabsContent value="payment">
            <DetailedEmployeePaymentReport key={refreshTrigger} />
          </TabsContent>
        </Tabs>

        <AdminDataEntryModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          onDataUpdate={handleDataUpdate}
        />
      </div>
    </div>
  );
};

export default Index;
