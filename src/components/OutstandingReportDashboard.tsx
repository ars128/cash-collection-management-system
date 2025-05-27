
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEmployeeData } from "@/hooks/useEmployeeData";

export const OutstandingReportDashboard = () => {
  const { employees, getEmployeeSummary } = useEmployeeData();

  const employeeSummaries = employees.map(employee => {
    const summary = getEmployeeSummary(employee.id);
    return {
      ...employee,
      ...summary
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-slate-200 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700 py-4">Employee ID</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Employee Name</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Net Collection Till Date</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Most Recent Transaction</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Outstanding Amount</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeSummaries.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-slate-50 transition-colors duration-150">
                <TableCell className="font-medium py-4">{employee.id}</TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {employee.name.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{employee.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 font-semibold text-green-600">
                  {formatCurrency(employee.totalCollection)}
                </TableCell>
                <TableCell className="py-4">
                  {employee.lastTransactionDate ? formatDate(employee.lastTransactionDate) : 'No transactions'}
                </TableCell>
                <TableCell className="py-4">
                  <span className={`font-semibold ${employee.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(Math.abs(employee.outstandingAmount))}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant={employee.outstandingAmount > 0 ? "destructive" : "default"}
                    className={employee.outstandingAmount > 0 ? "bg-red-100 text-red-800 hover:bg-red-200" : "bg-green-100 text-green-800 hover:bg-green-200"}
                  >
                    {employee.outstandingAmount > 0 ? 'Pending' : 'Clear'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {employeeSummaries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">No employee data available</div>
          <div className="text-slate-500">Use the "Insert Employee Data" button to add records</div>
        </div>
      )}
    </div>
  );
};
