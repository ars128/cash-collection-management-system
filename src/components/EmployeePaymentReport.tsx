
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
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

  // Calculate totals
  const totalCollection = transactions.reduce((sum, t) => sum + t.collection, 0);
  const totalDeposit = transactions.reduce((sum, t) => sum + t.deposit, 0);
  const totalDifference = totalCollection - totalDeposit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-purple-600">Employee Payment Report</h2>
        <X className="h-5 w-5 text-gray-400" />
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
                <p className="text-sm text-gray-500 mb-1">Total Collection</p>
                <p className="text-sm text-gray-500">(MM) Amount</p>
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
                <p className="text-sm text-gray-500 mb-1">Total Deposit</p>
                <p className="text-sm text-gray-500">Amount</p>
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
                <p className="text-sm text-gray-500 mb-1">Difference</p>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDifference)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <div></div>
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
              <TableHead className="font-medium text-gray-600 py-4">Cash Deposit</TableHead>
              <TableHead className="font-medium text-gray-600 py-4">Deposit Date</TableHead>
              <TableHead className="font-medium text-gray-600 py-4">Difference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={`${transaction.employeeId}-${transaction.date}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                <TableCell className="py-4 text-gray-600">BGRoad, Karnataka</TableCell>
                <TableCell className="font-medium py-4">{transaction.employeeId.replace('EMP00', '')}</TableCell>
                <TableCell className="py-4 font-medium text-gray-800">{transaction.employeeName}</TableCell>
                <TableCell className="py-4 font-medium">
                  {transaction.collection > 0 ? transaction.collection.toLocaleString() : '-'}
                </TableCell>
                <TableCell className="py-4 text-gray-600">
                  {transaction.collection > 0 ? formatDate(transaction.date) : '-'}
                </TableCell>
                <TableCell className="py-4 font-medium">
                  {transaction.deposit > 0 ? transaction.deposit.toLocaleString() : '-'}
                </TableCell>
                <TableCell className="py-4 text-gray-600">
                  {transaction.deposit > 0 ? formatDate(transaction.date) : '-'}
                </TableCell>
                <TableCell className="py-4">
                  <span className={`font-medium ${transaction.difference === 0 ? 'text-gray-600' : transaction.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.difference === 0 ? '-' : transaction.difference.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>
          <select className="border border-gray-300 rounded px-3 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span>Rows</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">1</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">4</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">5</button>
          <span className="px-2 text-gray-400">...</span>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">10</button>
          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">→</button>
        </div>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No transaction data available</div>
          <div className="text-gray-500">Use the "Insert Employee Data" button to add records</div>
        </div>
      )}
    </div>
  );
};
