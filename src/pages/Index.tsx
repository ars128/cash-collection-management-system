
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OutstandingReportDashboard } from "@/components/OutstandingReportDashboard";
import { EmployeePaymentReport } from "@/components/EmployeePaymentReport";
import { AdminDataEntryModal } from "@/components/AdminDataEntryModal";
import { Plus } from "lucide-react";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Employee Collection Management
          </h1>
          <p className="text-slate-600 text-lg">
            Track and manage employee collections and deposits
          </p>
        </div>

        <div className="mb-6 flex justify-end">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Insert Employee Data
          </Button>
        </div>

        <Tabs defaultValue="outstanding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white rounded-lg shadow-md p-1">
            <TabsTrigger 
              value="outstanding" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md py-3 text-lg font-medium transition-all duration-200"
            >
              Outstanding Report Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="payment" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md py-3 text-lg font-medium transition-all duration-200"
            >
              Employee Payment Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="outstanding" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold">Outstanding Report Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <OutstandingReportDashboard key={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold">Employee Payment Report Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <EmployeePaymentReport key={refreshTrigger} />
              </CardContent>
            </Card>
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
