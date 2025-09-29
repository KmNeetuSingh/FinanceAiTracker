require('dotenv').config({ override: true });
const { parseStatementWithAI } = require('./utils/aiParser');

async function testAI() {
  const sampleText = `
  Bank Statement for Account XXXX-XXXX-XXXX-1234
  Period: 01/01/2024 to 31/01/2024

  Transactions:
  05/01/2024 - Salary Credit - INR 50000.00 - Balance: 50000.00
  10/01/2024 - Amazon Shopping - INR 2500.00 - Balance: 47500.00
  15/01/2024 - Food Delivery - INR 450.00 - Balance: 47050.00
  20/01/2024 - Electricity Bill - INR 1200.00 - Balance: 45850.00
  25/01/2024 - ATM Withdrawal - INR 2000.00 - Balance: 43850.00
  `;

  console.log('Testing AI Parser with sample bank statement text...');
  try {
    const transactions = await parseStatementWithAI(sampleText);
    console.log('Parsed Transactions:');
    console.log(JSON.stringify(transactions, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAI();
