
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Employee {
  id: string;
  emp_id: string;
  name: string;
  email: string;
  department: string;
}

export interface Transaction {
  id: string;
  employee_id: string;
  transaction_date: string;
  collection_amount: number;
  deposit_amount: number;
}

export interface ProcessedTransaction extends Transaction {
  difference: number;
  runningBalance: number;
}

export interface EmployeeSummary {
  totalCollection: number;
  totalDeposit: number;
  outstandingAmount: number;
  lastTransactionDate: string | null;
}

export const useSupabaseEmployeeData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees
  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('emp_id');
    
    if (error) {
      console.error('Error fetching employees:', error);
      return;
    }
    
    setEmployees(data || []);
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date');
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }
    
    setTransactions(data || []);
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmployees(), fetchTransactions()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Add transaction
  const addTransaction = async (employeeId: string, transactionData: {
    transaction_date: string;
    collection_amount: number;
    deposit_amount: number;
  }) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        employee_id: employeeId,
        ...transactionData
      }])
      .select();

    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }

    // Refresh transactions
    await fetchTransactions();
    return data;
  };

  // Process transactions for an employee
  const processTransactions = (employeeTransactions: Transaction[]): ProcessedTransaction[] => {
    let runningBalance = 0;
    
    return employeeTransactions
      .sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime())
      .map(transaction => {
        const difference = transaction.deposit_amount - transaction.collection_amount;
        runningBalance += difference;
        
        return {
          ...transaction,
          difference,
          runningBalance
        };
      });
  };

  // Get transactions for a specific employee
  const getEmployeeTransactions = (employeeId: string): ProcessedTransaction[] => {
    const employeeTransactions = transactions.filter(t => t.employee_id === employeeId);
    return processTransactions(employeeTransactions);
  };

  // Get employee summary
  const getEmployeeSummary = (employeeId: string): EmployeeSummary => {
    const employeeTransactions = transactions.filter(t => t.employee_id === employeeId);
    
    if (employeeTransactions.length === 0) {
      return {
        totalCollection: 0,
        totalDeposit: 0,
        outstandingAmount: 0,
        lastTransactionDate: null
      };
    }

    const totalCollection = employeeTransactions.reduce((sum, t) => sum + t.collection_amount, 0);
    const totalDeposit = employeeTransactions.reduce((sum, t) => sum + t.deposit_amount, 0);
    const outstandingAmount = totalCollection - totalDeposit;
    
    const lastTransactionDate = employeeTransactions
      .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())[0]?.transaction_date || null;

    return {
      totalCollection,
      totalDeposit,
      outstandingAmount,
      lastTransactionDate
    };
  };

  return {
    employees,
    transactions,
    loading,
    addTransaction,
    getEmployeeTransactions,
    getEmployeeSummary,
    refreshData: () => Promise.all([fetchEmployees(), fetchTransactions()])
  };
};
