import React, { useState, useCallback } from 'react';
import { Transaction } from '../types';
import { CopyIcon, CheckIcon, TableIcon } from './icons';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const [copied, setCopied] = useState(false);

  const convertToTSV = (data: Transaction[]): string => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Notes'];
    const headerRow = headers.join('\t');
    const rows = data.map(tx => {
      // Replace any potential newline characters in fields to keep rows consistent
      const sanitizedDescription = (tx.description || '').replace(/(\r\n|\n|\r)/gm, " ");
      const rowData = [
        tx.date,
        sanitizedDescription,
        tx.amount,
        tx.category,
        tx.notes || ''
      ];
      return rowData.join('\t');
    });
    return [headerRow, ...rows].join('\n');
  };

  const handleCopy = useCallback(() => {
    const tsvData = convertToTSV(transactions);
    navigator.clipboard.writeText(tsvData).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TableIcon />
            Extracted Transactions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Found {transactions.length} transactions in the document.</p>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-all duration-200 w-full sm:w-auto"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied!' : 'Copy Table Data'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {transactions.map((tx, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{tx.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{tx.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">{tx.category}</span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold font-mono ${tx.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {tx.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};