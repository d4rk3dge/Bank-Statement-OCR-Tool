import { GoogleGenAI, Type } from '@google/genai';
import { StatementPageData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const statementSchema = {
    type: Type.OBJECT,
    properties: {
        openingBalance: {
            type: Type.NUMBER,
            description: "The opening balance for the statement period on this page. Return null if not explicitly found.",
        },
        closingBalance: {
            type: Type.NUMBER,
            description: "The closing balance for the statement period on this page. Return null if not explicitly found.",
        },
        transactions: {
            type: Type.ARRAY,
            description: 'A list of all transactions found on the statement page.',
            items: {
                type: Type.OBJECT,
                properties: {
                    date: {
                        type: Type.STRING,
                        description: 'Transaction date in DD-MM-YYYY format. Infer the year if missing.',
                    },
                    description: {
                        type: Type.STRING,
                        description: 'A concise 2-3 word transaction description or merchant name.',
                    },
                    amount: {
                        type: Type.NUMBER,
                        description: 'Transaction amount. Use a negative number for debits/expenses/withdrawals and a positive number for credits/deposits.',
                    },
                    category: {
                        type: Type.STRING,
                        description: 'A suggested category based on the description, e.g., "Groceries", "Salary", "Utilities", "Shopping", "Dining", "Travel".',
                    },
                },
                required: ['date', 'description', 'amount', 'category'],
            },
        },
    },
    required: ['transactions'],
};

const prompt = `You are an expert financial assistant specializing in Indian bank statement analysis. Analyze this image of a bank statement page and extract all transactional data and summary balances.

Your task is to:
1.  Identify every individual transaction line.
2.  For each transaction, extract the date, a short 2-3 word description, and the amount.
3.  Format the date as DD-MM-YYYY. If the year is not explicitly mentioned, infer it from the statement's context.
4.  Keep the description concise, only 2-3 words.
5.  Represent debits, withdrawals, and expenses as NEGATIVE numbers.
6.  Represent credits and deposits as POSITIVE numbers.
7.  Assign a relevant financial category to each transaction.
8.  Identify the Opening Balance and Closing Balance for the period shown on this page. If a value is not present on the page, return null for that field.
9.  Respond ONLY with a single JSON object that strictly adheres to the provided schema. Do not include any other text, explanations, or markdown formatting.`;


export const extractTransactionsFromImage = async (
    imagePart: { mimeType: string, data: string }
): Promise<StatementPageData> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [{ text: prompt }, { inlineData: imagePart }],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: statementSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (parsedJson && Array.isArray(parsedJson.transactions)) {
            // Filter out any potentially malformed entries
            const validTransactions = parsedJson.transactions.filter(
                (tx: any) => tx.date && tx.description && typeof tx.amount === 'number' && tx.category
            );
            
            return {
                transactions: validTransactions,
                openingBalance: parsedJson.openingBalance,
                closingBalance: parsedJson.closingBalance,
            };
        }

        return { transactions: [] };

    } catch (error) {
        console.error('Error processing image with Gemini:', error);
        throw new Error('Failed to extract transactions. The document might be unclear or in an unsupported format.');
    }
};
