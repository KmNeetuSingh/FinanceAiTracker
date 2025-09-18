// utils/aiParser.js
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to validate and fix date format
function validateAndFixDate(dateString) {
  if (!dateString) {
    return new Date().toISOString().split("T")[0]; // Return current date if no date provided
  }

  try {
    // Check if date is in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      
      // Validate date components
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        // Create a proper date string
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const testDate = new Date(formattedDate);
        
        if (!isNaN(testDate.getTime())) {
          return formattedDate;
        }
      }
    }
    
    // Try to parse other date formats
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split("T")[0];
    }
    
    // If all else fails, return current date
    return new Date().toISOString().split("T")[0];
  } catch (error) {
    console.error("Date parsing error:", error);
    return new Date().toISOString().split("T")[0];
  }
}

// Function to validate and fix transaction data
function validateAndFixTransaction(transaction) {
  // Validate and fix date
  transaction.date = validateAndFixDate(transaction.date);
  
  // Validate amount
  if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
    transaction.amount = parseFloat(transaction.amount) || 0;
  }
  
  // Validate description
  if (!transaction.description || typeof transaction.description !== 'string') {
    transaction.description = "Unknown transaction";
  }
  
  // Validate merchant
  if (!transaction.merchant || typeof transaction.merchant !== 'string') {
    transaction.merchant = "";
  }
  
  // Validate category
  const validCategories = ['food', 'utilities', 'entertainment', 'transportation', 'healthcare', 'shopping', 'income', 'transfer', 'other'];
  if (!transaction.category || !validCategories.includes(transaction.category)) {
    transaction.category = "other";
  }
  
  // Validate type based on amount
  if (!transaction.type || (transaction.type !== 'income' && transaction.type !== 'expense')) {
    transaction.type = transaction.amount >= 0 ? 'income' : 'expense';
  }
  
  return transaction;
}

// Function to generate mock data for testing when API fails
function generateMockData() {
  const currentDate = new Date();
  const mockTransactions = [
    {
      date: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: 50000,
      description: 'Salary Credit',
      merchant: 'Company XYZ',
      category: 'income',
      type: 'income'
    },
    {
      date: new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: -2500,
      description: 'Amazon Shopping',
      merchant: 'Amazon',
      category: 'shopping',
      type: 'expense'
    },
    {
      date: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: -450,
      description: 'Food Delivery',
      merchant: 'Zomato',
      category: 'food',
      type: 'expense'
    },
    {
      date: new Date(currentDate.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: -1200,
      description: 'Electricity Bill',
      merchant: 'Electricity Department',
      category: 'utilities',
      type: 'expense'
    },
    {
      date: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: -2000,
      description: 'ATM Withdrawal',
      merchant: 'Bank ATM',
      category: 'other',
      type: 'expense'
    }
  ];
  
  return mockTransactions;
}

async function parseStatementWithAI(textContent) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('OpenAI API key not configured, using mock data');
      return generateMockData();
    }

    const prompt = `
    Analyze this bank statement text and extract all transactions.
    Return ONLY a JSON array of transactions with these fields:
    - date (YYYY-MM-DD format, infer year if missing)
    - amount (positive for income, negative for expenses)
    - description (clean transaction description)
    - merchant (where the transaction occurred)
    - category (food, utilities, entertainment, transportation, healthcare, shopping, income, transfer, other)
    - type ("income" or "expense" based on amount)

    Important: 
    1. Date must be in YYYY-MM-DD format only
    2. Month must be between 01-12
    3. Day must be between 01-31
    4. Return valid JSON only

    If a field cannot be determined, use a reasonable default.

    Statement text: ${textContent.substring(0, 3000)}

    JSON response:
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a financial data extraction expert. Extract transactions from bank statements and return only valid JSON. Always return an array, even if it's empty. Ensure dates are in YYYY-MM-DD format with valid month (01-12) and day (01-31) values.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw new Error("Invalid JSON response from AI");
    }

    // Extract transactions array (handle both {transactions: []} and direct array responses)
    let transactions = [];
    if (Array.isArray(parsedResponse)) {
      transactions = parsedResponse;
    } else if (parsedResponse.transactions && Array.isArray(parsedResponse.transactions)) {
      transactions = parsedResponse.transactions;
    } else {
      throw new Error("No transactions array found in AI response");
    }

    // Validate and fix each transaction
    const validatedTransactions = transactions.map(transaction => 
      validateAndFixTransaction({
        date: transaction.date || "",
        amount: transaction.amount || 0,
        description: transaction.description || "",
        merchant: transaction.merchant || "",
        category: transaction.category || "other",
        type: transaction.type || ""
      })
    );

    return validatedTransactions;

  } catch (error) {
    console.error("AI processing error:", error);
    
    // If API quota exceeded or other API error, use mock data
    if (error.status === 429 || error.message.includes('quota') || error.message.includes('billing')) {
      console.log('OpenAI API limit exceeded, using mock data instead');
      return generateMockData();
    }
    
    throw new Error(`AI processing failed: ${error.message}`);
  }
}

module.exports = { parseStatementWithAI };