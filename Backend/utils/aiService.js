const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to calculate totals from transactions
function calculateTotals(transactions) {
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const categoryTotals = {};
  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      const category = tx.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(tx.amount);
    });

  const maxCategory = Object.keys(categoryTotals).length > 0
    ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
    : 'other';

  return { totalIncome, totalExpense, categoryTotals, maxCategory };
}

// Function to generate AI message
async function generateFinanceMessage(totalIncome, totalExpense, maxCategory, categoryTotals) {
  const prompt = `You are a friendly finance assistant.
User's total income: ₹${totalIncome}
User's total expenses: ₹${totalExpense}
Category with highest expense this month: ${maxCategory}

Generate a short, friendly, actionable Hinglish message (max 3 sentences):
- If expenses > income → warning tone + tip to save
- If expenses ≤ income → congratulatory tone
Mention the category with highest spending in the message. Also, include a subtle suggestion to re-upload the statement next month for continued insights.

Response should be only the message text, no quotes or extra formatting.`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a friendly finance assistant generating personalized messages in Hinglish.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating AI message:', error);
    // Fallback
    if (totalExpense > totalIncome) {
      return `Iss month aapka kharch ₹${totalExpense} income ₹${totalIncome} se zyada ho gaya hai! Sabse zyada ₹${Math.max(...Object.values(categoryTotals))} ${maxCategory} me kharch hua. Thoda control rakhiye aur next month save karna start kariye ⚠️. Agle mahine bhi statement upload karna na bhulein!`;
    } else {
      return `Aapne ₹${totalExpense} ka kharch kiya aur ₹${totalIncome} income ke andar raha. Sabse zyada ${maxCategory} me kharch hua. Great job, keep it up! 🥳. Agle mahine bhi statement upload karke apni financial journey track karte rahein!`;
    }
  }
}
// Main function to get finance summary
async function getFinanceSummary(transactions) {
  const { totalIncome, totalExpense, categoryTotals, maxCategory } = calculateTotals(transactions);
  const message = await generateFinanceMessage(totalIncome, totalExpense, maxCategory, categoryTotals);

  return { totalIncome, totalExpense, categoryTotals, maxCategory, message };
}

module.exports = { getFinanceSummary };
