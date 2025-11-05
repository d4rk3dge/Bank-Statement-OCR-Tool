export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  notes?: string;
}

export interface BalanceInfo {
  openingBalance: number | null;
  totalCredits: number;
  totalDebits: number;
  closingBalance: number | null;
}

export interface StatementPageData {
  transactions: Transaction[];
  openingBalance?: number | null;
  closingBalance?: number | null;
}
