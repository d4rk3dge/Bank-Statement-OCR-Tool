# Bank Statement OCR Tool powered by Gemini AI

An intelligent tool that uses Google's Gemini AI to extract transaction data from bank statements (PDFs/Images) and convert it into a clean, copyable TSV (Tab-Separated Values) format, perfect for pasting into spreadsheets.

![Bank Statement OCR Tool Screenshot](https://storage.googleapis.com/aistudio-web-public/gallery/99e69188-7e30-4e0d-9e66-e820875e53e7.png)

## ✨ Features

- **Multi-Format Upload**: Supports both PDF and common image formats (PNG, JPG, WEBP).
- **Batch Processing**: Upload and process multiple files or multi-page PDFs in a single go.
- **Intelligent Data Extraction**: Leverages the Gemini API with a structured JSON schema to accurately extract:
  - Transaction Date
  - Concise Description
  - Amount (correctly identifying debits and credits)
  - Auto-Suggested Category (e.g., "Shopping", "Salary", "Utilities")
- **Statement Summary**: Automatically calculates and displays key metrics like Opening Balance, Closing Balance, Total Credits, and Total Debits.
- **User-Friendly Interface**: A clean, responsive, and intuitive UI with a drag-and-drop file area and dark mode support.
- **Easy Export**: A "Copy Table Data" button that formats the extracted transactions into TSV format for easy pasting into Google Sheets, Excel, or other spreadsheet software.
- **Real-time Feedback**: Provides users with clear status updates during the processing and handles potential errors gracefully.
- **Client-Side PDF Handling**: Uses `pdf.js` to render PDF pages into images directly in the browser, ensuring user privacy as raw PDF files are not uploaded.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI/ML**: Google Gemini API (`@google/genai`)
- **PDF Processing**: PDF.js (`pdfjs-dist`)

## 🚀 How It Works

1.  **File Upload**: The user drags and drops or selects one or more bank statement files (PDF/Image).
2.  **Client-Side Pre-processing**:
    - If a file is an **image**, it is converted to a base64 string.
    - If a file is a **PDF**, the application uses `pdf.js` to iterate through each page. Every page is rendered onto an HTML `<canvas>` element at a high resolution and then converted into a base64 encoded JPEG image.
3.  **API Call to Gemini**: Each generated image is sent to the Gemini API (`gemini-2.5-flash` model) as an `inlineData` part.
4.  **Structured Prompting**: The API request includes a detailed prompt instructing the model to act as a financial expert. Crucially, it also includes a `responseSchema` which forces the model to return its findings in a clean, predictable JSON format.
5.  **Data Parsing & Display**: The frontend receives the structured JSON response.
    - The `transactions` array is used to populate the main data table.
    - `openingBalance` and `closingBalance` are extracted.
    - Total credits and debits are calculated by summing the positive and negative transaction amounts.
    - All data is displayed in the summary cards and the transaction table.
6.  **Data Export**: When the user clicks "Copy Table Data", the application converts the transaction array into a TSV string and copies it to the clipboard.

## ⚙️ Setup and Running Locally

To run this project on your local machine, follow these steps:

**1. Clone the repository:**

```bash
git clone https://github.com/your-username/bank-statement-ocr-tool.git
cd bank-statement-ocr-tool
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set up environment variables:**

You'll need a Google Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/).

Create a file named `.env` in the root of the project and add your API key:

```
API_KEY=your_google_gemini_api_key_here
```

*Note: The project is set up to load this variable via a bundler like Vite. The provided `index.tsx` assumes `process.env.API_KEY` is available.*

**4. Run the development server:**

```bash
npm run dev
```

The application should now be running on your local development server, typically at `http://localhost:5173`.

## 📂 Project Structure

```
/
├── public/
│   └── ... (static assets)
├── src/
│   ├── components/
│   │   ├── BalanceSummary.tsx
│   │   ├── FileUpload.tsx
│   │   ├── icons.tsx
│   │   └── TransactionTable.tsx
│   ├── services/
│   │   └── geminiService.ts   # Logic for interacting with the Gemini API
│   ├── App.tsx                # Main application component and state management
│   ├── index.tsx              # Application entry point
│   └── types.ts               # TypeScript type definitions
├── .env                       # Environment variables (API key)
├── index.html                 # Main HTML file
└── package.json
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
