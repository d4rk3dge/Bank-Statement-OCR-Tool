import React from 'react';
import { BalanceInfo } from '../types';

interface BalanceSummaryProps {
  balances: BalanceInfo;
}

const formatCurrency = (amount: number | null) => {
    if (amount === null || typeof amount === 'undefined') {
        return 'N/A';
    }
    return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
};


export const BalanceSummary: React.FC<BalanceSummaryProps> = ({ balances }) => {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Statement Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
        {/* Card for Opening Balance */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Opening Balance</p>
          <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-1">{formatCurrency(balances.openingBalance)}</p>
        </div>
        {/* Card for Total Credits */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Credits</p>
          <p className="text-xl md:text-2xl font-semibold text-green-700 dark:text-green-300 mt-1">{formatCurrency(balances.totalCredits)}</p>
        </div>
        {/* Card for Total Debits */}
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Debits</p>
          <p className="text-xl md:text-2xl font-semibold text-red-700 dark:text-red-300 mt-1">{formatCurrency(Math.abs(balances.totalDebits))}</p>
        </div>
        {/* Card for Closing Balance */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Closing Balance</p>
          <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-1">{formatCurrency(balances.closingBalance)}</p>
        </div>
      </div>
    </div>
  );
};
