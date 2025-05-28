💼 Employee Payment Reconciliation Dashboard
A mini web application built with React and Supabase that tracks daily collection vs deposit transactions for employees and enforces a carry-forward balance logic. If an employee's deposit on a given day is less than the collection amount, the shortfall is rolled over and must be cleared by future deposits. The app processes transaction data, maintains a running balance, and generates an intuitive dashboard to visualize employee payment behavior.

Key Features:

Fetch and display employee-wise transaction data

Calculate running outstanding balances per employee

Apply deposit payments to past shortfalls based on business rules

Built using React, TypeScript, and Supabase (PostgreSQL backend)

