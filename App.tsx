import React, { useState, useCallback } from 'react';
import { Transaction, BalanceInfo } from './types';
import { extractTransactionsFromImage } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { TransactionTable } from './components/TransactionTable';
import { BalanceSummary } from './components/BalanceSummary';
import { LogoIcon, SpinnerIcon } from './components/icons';

// Make pdfjs an external script
declare const pdfjsLib: any;

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balances, setBalances] = useState<BalanceInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Ready to process your bank statements.');
  const [error, setError] = useState<string | null>(null);

  const fileToGenerativePart = async (file: File): Promise<{ mimeType: string; data: string }> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        }
      };
      reader.readAsDataURL(file);
    });
    return {
      mimeType: file.type,
      data: await base64EncodedDataPromise,
    };
  };
  
  const canvasToGenerativePart = async (canvas: HTMLCanvasElement): Promise<{ mimeType: string; data: string }> => {
    const base64EncodedData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    return {
      mimeType: 'image/jpeg',
      data: base64EncodedData,
    };
  }

  const handleFilesProcess = useCallback(async (files: File[]) => {
    setIsLoading(true);
    setTransactions([]);
    setBalances(null);
    setError(null);
    setStatus('Initializing...');

    let allTransactions: Transaction[] = [];
    let firstOpeningBalance: number | null = null;
    let lastClosingBalance: number | null = null;

    try {
      for (const [index, file] of files.entries()) {
        setStatus(`Processing file ${index + 1} of ${files.length}: ${file.name}`);

        if (file.type === 'application/pdf') {
          if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF.js library is not loaded. Please check your internet connection and refresh.');
          }
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;
          
          const typedarray = new Uint8Array(await file.arrayBuffer());
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          const numPages = pdf.numPages;

          for (let i = 1; i <= numPages; i++) {
              setStatus(`Processing page ${i} of ${numPages} (File ${index + 1}/${files.length})`);
              const page = await pdf.getPage(i);
              const viewport = page.getViewport({ scale: 2 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              if (context) {
                  await page.render({ canvasContext: context, viewport: viewport }).promise;
                  const imagePart = await canvasToGenerativePart(canvas);
                  const pageData = await extractTransactionsFromImage(imagePart);
                  
                  allTransactions.push(...pageData.transactions);

                  if (index === 0 && i === 1 && pageData.openingBalance != null) {
                      firstOpeningBalance = pageData.openingBalance;
                  }
                  if (pageData.closingBalance != null) {
                      lastClosingBalance = pageData.closingBalance;
                  }
                  
                  setTransactions([...allTransactions]);
              }
          }
        } else if (file.type.startsWith('image/')) {
          setStatus(`Processing image: ${file.name}`);
          const imagePart = await fileToGenerativePart(file);
          const pageData = await extractTransactionsFromImage(imagePart);

          allTransactions.push(...pageData.transactions);
          
          if (index === 0 && pageData.openingBalance != null) {
            firstOpeningBalance = pageData.openingBalance;
          }
          if (pageData.closingBalance != null) {
            lastClosingBalance = pageData.closingBalance;
          }

          setTransactions([...allTransactions]);
        } else {
          throw new Error(`Unsupported file type: ${file.name}. Please upload PDF or image files.`);
        }
      }

      const totalCredits = allTransactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
      const totalDebits = allTransactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);
      
      setBalances({ 
        openingBalance: firstOpeningBalance, 
        closingBalance: lastClosingBalance, 
        totalCredits, 
        totalDebits 
      });
      setStatus(`Successfully processed ${files.length} file(s) and extracted ${allTransactions.length} transactions.`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setStatus('Processing failed.');
    } finally {
        setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 antialiased">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <LogoIcon />
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Bank Statement OCR Tool
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your bank statement (PDF or image) and let Gemini AI extract all transactions into a clean, ready-to-use CSV format.
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <FileUpload onFileSelect={handleFilesProcess} disabled={isLoading} />
            
            {isLoading && (
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <SpinnerIcon />
                  <p className="text-lg font-medium text-blue-600 dark:text-blue-400">{status}</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-6 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>
          
          {!isLoading && balances && (
            <BalanceSummary balances={balances} />
          )}

          {!isLoading && transactions.length > 0 && (
             <TransactionTable transactions={transactions} />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;