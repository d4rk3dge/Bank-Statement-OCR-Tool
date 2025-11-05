<div align="center">
<img width="450" height="120" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Bank Statement OCR Tool

Tired of manually entering data from your bank statements? This tool is for you!

The Bank Statement OCR Tool is a web application that uses the power of Gemini AI to automatically extract transactions from your bank statements. Simply upload a PDF or image of your statement, and the tool will parse the data and present it in a clean, easy-to-use format. You can then download the extracted transactions as a CSV file for use in your favorite spreadsheet software.

## Why Use This Tool?

| Feature | Manual Data Entry | Bank Statement OCR Tool |
| :--- | :---: | :---: |
| **Time** | Hours of tedious work | Seconds |
| **Accuracy** | Prone to human error | Highly accurate |
| **Convenience** | Mind-numbing | Simple and intuitive |
| **Cost** | Free (but costs your sanity) | Free |

## Features

*   **Extract transactions from PDF and image files:** Upload your bank statements in either PDF or image format.
*   **Powered by Gemini AI:** Uses Google's state-of-the-art AI for high accuracy.
*   **View and download transactions:** See the extracted transactions in a clean table and download them as a CSV file.
*   **Balance summary:** Get a quick overview of your opening and closing balances, as well as total credits and debits.
*   **Easy to use:** Simple and intuitive interface.

## Getting Started

**Prerequisites:**

*   [Node.js](https://nodejs.org/) installed on your machine.Access the folder "bank-statement-ocr-tool". Read through the files. Write me a Readme.md for me to upload it
  into the github. Do not mention Googele AI Studio in the Readme.md file. Add some comparision message to make it
*   A Gemini API key. You can get one from [Google AI for Developers](https://ai.google.dev/).

**Installation:**

1.  Clone this repository:
    ```bash
    git clone https://github.com/your-username/bank-statement-ocr-tool.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the root of the project and add your Gemini API key:
    ```
    GEMINI_API_KEY=your-api-key
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open your browser and navigate to `http://localhost:5173` (or the address shown in your terminal).

## Technologies Used

*   [React](https://reactjs.org/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/)
*   [Gemini AI](https://ai.google.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
