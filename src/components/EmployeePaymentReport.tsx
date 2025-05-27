
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEmployeeData } from "@/hooks/useEmployeeData";

export const EmployeePaymentReport = () => {
  const { employees, getEmployeeTransactions } = useEmployeeData();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const getTransactionsToShow = () => {
    if (selectedEmployeeId === 'all') {
      return employees.flatMap(employee => 
        getEmployeeTransactions(employee.id).map(transaction => ({
          ...transaction,
          employeeName: employee.name,
          employeeId: employee.id
        }))
      ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      const employee = employees.find(emp => emp.id === selectedEmployeeId);
      return getEmployeeTransactions(selectedEmployeeId).map(transaction => ({
        ...transaction,
        employeeName: employee?.name || '',
        employeeId: selectedEmployeeId
      }));
    }
  };

  const transactions = getTransactionsToShow();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-700">Filter by Employee</h3>
        <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees.map(employee => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name} (ID: {employee.id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-700 py-4">Employee ID</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Employee Name</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Date</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">MM Collection</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Deposit Amount</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Difference</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Running Balance</TableHead>
              <TableHead className="font-semibold text-slate-700 py-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={`${transaction.employeeId}-${transaction.date}-${index}`} className="hover:bg-slate-50 transition-colors duration-150">
                <TableCell className="font-medium py-4">{transaction.employeeId}</TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {transaction.employeeName.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium">{transaction.employeeName}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">{formatDate(transaction.date)}</TableCell>
                <TableCell className="py-4 font-semibold text-blue-600">
                  {formatCurrency(transaction.collection)}
                </TableCell>
                <TableCell className="py-4 font-semibold text-green-600">
                  {formatCurrency(transaction.deposit)}
                </TableCell>
                <TableCell className="py-4">
                  <span className={`font-semibold ${transaction.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(transaction.difference)}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <span className={`font-semibold ${transaction.runningBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(transaction.runningBalance))}
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <Badge 
                    variant={transaction.difference >= 0 ? "default" : "destructive"}
                    className={transaction.difference >= 0 ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}
                  >
                    {transaction.difference >= 0 ? 'Balanced' : 'Deficit'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">No transaction data available</div>
          <div className="text-slate-500">Use the "Insert Employee Data" button to add records</div>
        </div>
      )}
    </div>
  );
};
