
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseEmployeeData } from "@/hooks/useSupabaseEmployeeData";

export const OutstandingReportDashboard = () => {
  const { employees, getEmployeeSummary } = useSupabaseEmployeeData();

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

  // Calculate totals
  const totalCollection = employeeSummaries.reduce((sum, emp) => sum + emp.totalCollection, 0);
  const totalDeposit = employeeSummaries.reduce((sum, emp) => sum + emp.totalDeposit, 0);
  const totalDifference = totalCollection - totalDeposit;

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold text-purple-600 mb-4">
        Outstanding Report (All Locations)
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Collection (MM)</p>
                <p className="text-sm text-gray-500">(All Locations)</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalCollection)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Deposit Amount</p>
                <p className="text-sm text-gray-500">(All Locations)</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalDeposit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">=</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Difference Amount</p>
                <p className="text-sm text-gray-500">(All Locations)</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDifference)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium text-gray-600 py-4">Location</TableHead>
              <TableHead className="font-medium text-gray-600 py-4">Emp. ID</TableHead>
              <TableHead className="font-medium text-gray-600 py-4">Emp. Name</TableHead>
              <TableHead className="font-medium text-gray-600 py-4">Collections (MM)</TableHead>
              <TableHead className="font-medium text-gray-600 py-4">Date</TableHead>
              <TableHead className="font-medium text-gray-600 py-4">Difference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeSummaries.map((employee) => (
              <TableRow key={employee.id} className="hover:bg-gray-50 transition-colors duration-150">
                <TableCell className="py-4 text-gray-600">BGRoad, Karnataka</TableCell>
                <TableCell className="font-medium py-4">{employee.emp_id.replace('EMP', '')}</TableCell>
                <TableCell className="py-4 font-medium text-gray-800">{employee.name}</TableCell>
                <TableCell className="py-4 font-medium">
                  {employee.totalCollection.toLocaleString()}
                </TableCell>
                <TableCell className="py-4 text-gray-600">
                  {employee.lastTransactionDate ? formatDate(employee.lastTransactionDate) : '26 Mar 2025'}
                </TableCell>
                <TableCell className="py-4">
                  <span className={`font-medium ${employee.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {employee.outstandingAmount > 0 ? employee.outstandingAmount.toLocaleString() : `(${Math.abs(employee.outstandingAmount).toLocaleString()})`}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {employeeSummaries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No employee data available</div>
          <div className="text-gray-500">Use the "Insert Employee Data" button to add records</div>
        </div>
      )}
    </div>
  );
};
