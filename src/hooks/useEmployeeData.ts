
import { useState, useEffect } from 'react';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface Transaction {
  date: string;
  collection: number;
  deposit: number;
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

const STORAGE_KEY = 'employeeCollectionData';

// Sample employee data
const initialEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Mayank Sharma',
    email: 'mayank.sharma@company.com',
    department: 'Collections'
  },
  {
    id: 'EMP002',
    name: 'Priya Patel',
    email: 'priya.patel@company.com',
    department: 'Collections'
  },
  {
    id: 'EMP003',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    department: 'Collections'
  },
  {
    id: 'EMP004',
    name: 'Anjali Singh',
    email: 'anjali.singh@company.com',
    department: 'Collections'
  },
  {
    id: 'EMP005',
    name: 'Vikram Gupta',
    email: 'vikram.gupta@company.com',
    department: 'Collections'
  }
];

// Sample transaction data for demonstration
const initialTransactions: Record<string, Transaction[]> = {
  'EMP001': [
    { date: '2025-03-26', collection: 10000, deposit: 0 },
    { date: '2025-03-27', collection: 20000, deposit: 0 },
    { date: '2025-03-28', collection: 0, deposit: 5000 },
    { date: '2025-03-29', collection: 0, deposit: 7000 },
    { date: '2025-03-30', collection: 0, deposit: 8000 },
    { date: '2025-03-31', collection: 0, deposit: 15000 }
  ],
  'EMP002': [
    { date: '2025-03-25', collection: 15000, deposit: 0 },
    { date: '2025-03-26', collection: 12000, deposit: 15000 },
    { date: '2025-03-27', collection: 0, deposit: 12000 }
  ],
  'EMP003': [
    { date: '2025-03-24', collection: 8000, deposit: 0 },
    { date: '2025-03-25', collection: 0, deposit: 8000 }
  ]
};

export const useEmployeeData = () => {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTransactions(parsed);
      } catch (error) {
        console.error('Error loading saved data:', error);
        setTransactions(initialTransactions);
      }
    } else {
      setTransactions(initialTransactions);
    }
  }, []);

  // Save data to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (employeeId: string, transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => ({
      ...prev,
      [employeeId]: [...(prev[employeeId] || []), transaction].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    }));
  };

  const processTransactions = (employeeTransactions: Transaction[]): ProcessedTransaction[] => {
    let runningBalance = 0;
    
    return employeeTransactions.map(transaction => {
      const difference = transaction.deposit - transaction.collection;
      runningBalance += difference;
      
      return {
        ...transaction,
        difference,
        runningBalance
      };
    });
  };

  const getEmployeeTransactions = (employeeId: string): ProcessedTransaction[] => {
    const employeeTransactions = transactions[employeeId] || [];
    return processTransactions(employeeTransactions);
  };

  const getEmployeeSummary = (employeeId: string): EmployeeSummary => {
    const employeeTransactions = transactions[employeeId] || [];
    
    if (employeeTransactions.length === 0) {
      return {
        totalCollection: 0,
        totalDeposit: 0,
        outstandingAmount: 0,
        lastTransactionDate: null
      };
    }

    const totalCollection = employeeTransactions.reduce((sum, t) => sum + t.collection, 0);
    const totalDeposit = employeeTransactions.reduce((sum, t) => sum + t.deposit, 0);
    const outstandingAmount = totalCollection - totalDeposit;
    
    // Find the most recent transaction date
    const lastTransactionDate = employeeTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || null;

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
    addTransaction,
    getEmployeeTransactions,
    getEmployeeSummary
  };
};
