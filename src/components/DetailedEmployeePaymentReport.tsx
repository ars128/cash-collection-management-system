
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseEmployeeData } from "@/hooks/useSupabaseEmployeeData";

interface DetailedTransaction {
  location: string;
  empId: string;
  empName: string;
  collectionAmount: number;
  collectionDate: string;
  depositAmount: number;
  depositDate: string;
  difference: number;
}

export const DetailedEmployeePaymentReport = () => {
  const { employees, transactions } = useSupabaseEmployeeData();
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

  // Process transactions with the specific business logic
  const processEmployeeTransactions = (employeeId: string): DetailedTransaction[] => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return [];

    const employeeTransactions = transactions
      .filter(t => t.employee_id === employeeId)
      .sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime());

    const detailedTransactions: DetailedTransaction[] = [];
    let pendingCollections: { amount: number; date: string }[] = [];

    // Group transactions by date
    const transactionsByDate = employeeTransactions.reduce((acc, transaction) => {
      const date = transaction.transaction_date;
      if (!acc[date]) {
        acc[date] = { collections: 0, deposits: 0 };
      }
      acc[date].collections += transaction.collection_amount;
      acc[date].deposits += transaction.deposit_amount;
      return acc;
    }, {} as Record<string, { collections: number; deposits: number }>);

    // Process each date chronologically
    Object.entries(transactionsByDate)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .forEach(([date, { collections, deposits }]) => {
        // Add collection entry if there's a collection
        if (collections > 0) {
          pendingCollections.push({ amount: collections, date });
          detailedTransactions.push({
            location: 'BGRoad, Karnataka',
            empId: employee.emp_id.replace('EMP', ''),
            empName: employee.name,
            collectionAmount: collections,
            collectionDate: date,
            depositAmount: 0,
            depositDate: '',
            difference: 0
          });
        }

        // Process deposits
        if (deposits > 0) {
          let remainingDeposit = deposits;
          const depositDate = date;

          // First, try to clear pending collections in chronological order
          for (let i = 0; i < pendingCollections.length && remainingDeposit > 0; i++) {
            const pending = pendingCollections[i];
            const amountToClear = Math.min(pending.amount, remainingDeposit);
            
            if (amountToClear > 0) {
              // Find the corresponding collection entry and update it
              const collectionEntry = detailedTransactions.find(
                dt => dt.collectionDate === pending.date && dt.depositAmount === 0
              );
              
              if (collectionEntry) {
                collectionEntry.depositAmount = amountToClear;
                collectionEntry.depositDate = depositDate;
                collectionEntry.difference = amountToClear - collectionEntry.collectionAmount;
              }

              pending.amount -= amountToClear;
              remainingDeposit -= amountToClear;
            }
          }

          // Remove fully cleared collections
          pendingCollections = pendingCollections.filter(p => p.amount > 0);

          // If there's remaining deposit after clearing collections, add separate deposit entries
          while (remainingDeposit > 0) {
            detailedTransactions.push({
              location: 'BGRoad, Karnataka',
              empId: employee.emp_id.replace('EMP', ''),
              empName: employee.name,
              collectionAmount: 0,
              collectionDate: '',
              depositAmount: remainingDeposit,
              depositDate: depositDate,
              difference: remainingDeposit
            });
            remainingDeposit = 0;
          }
        }
      });

    return detailedTransactions;
  };

  const getTransactionsToShow = (): DetailedTransaction[] => {
    if (selectedEmployeeId === 'all') {
      return employees.flatMap(employee => processEmployeeTransactions(employee.id));
    } else {
      return processEmployeeTransactions(selectedEmployeeId);
    }
  };

  const detailedTransactions = getTransactionsToShow();

  // Calculate totals
  const totalCollection = detailedTransactions.reduce((sum, t) => sum + t.collectionAmount, 0);
  const totalDeposit = detailedTransactions.reduce((sum, t) => sum + t.depositAmount, 0);
  const totalDifference = totalDeposit - totalCollection;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-purple-600">Employee Payment Report (Detailed)</h2>
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
                <p className="text-sm text-gray-500 mb-1">Net Difference</p>
                <p className="text-sm text-gray-500">Amount</p>
                <p className={`text-2xl font-bold ${totalDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalDifference)}
                </p>
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
                {employee.name} (ID: {employee.emp_id})
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
            {detailedTransactions.map((transaction, index) => (
              <TableRow key={`${transaction.empId}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                <TableCell className="py-4 text-gray-600">{transaction.location}</TableCell>
                <TableCell className="font-medium py-4">{transaction.empId}</TableCell>
                <TableCell className="py-4 font-medium text-gray-800">{transaction.empName}</TableCell>
                <TableCell className="py-4 font-medium">
                  {transaction.collectionAmount > 0 ? transaction.collectionAmount.toLocaleString() : '-'}
                </TableCell>
                <TableCell className="py-4 text-gray-600">
                  {transaction.collectionDate ? formatDate(transaction.collectionDate) : '-'}
                </TableCell>
                <TableCell className="py-4 font-medium">
                  {transaction.depositAmount > 0 ? transaction.depositAmount.toLocaleString() : '-'}
                </TableCell>
                <TableCell className="py-4 text-gray-600">
                  {transaction.depositDate ? formatDate(transaction.depositDate) : '-'}
                </TableCell>
                <TableCell className="py-4">
                  <span className={`font-medium ${
                    transaction.difference === 0 ? 'text-gray-600' : 
                    transaction.difference > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.difference === 0 ? '-' : transaction.difference.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {detailedTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No transaction data available</div>
          <div className="text-gray-500">Use the "Insert Employee Data" button to add records</div>
        </div>
      )}
    </div>
  );
};
