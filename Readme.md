# Finance AI Tracker

Finance AI Tracker is a full-stack FinTech application that leverages AI to help users manage their finances by uploading bank statements, getting automated insights, and tracking their financial health.

## Live Demo

https://github.com/user-attachments/assets/936eb0c3-77ed-4ab0-b0de-2bfa7e46b9e2

---

## Technology Stack Overview

**Core Technologies:**
* **Frontend:** React 18 with Tailwind CSS
* **Backend:** Node.js with Express.js
* **Database:** MongoDB (NoSQL)
* **AI Engine:** OpenAI GPT-4o-mini
* **Security:** JWT Authentication with bcrypt

---

## System Architecture

```
                         USER (Web Browser)
                                 |
                                 | HTTPS Request
                                 v
        +------------------------------------------------+
        |            FRONTEND LAYER                      |
        |            React 18 + Vite                     |
        |                                                |
        |  Components:                                   |
        |  - React Router (Navigation)                   |
        |  - Tailwind CSS (Styling)                      |
        |  - Recharts (Data Visualization)               |
        |  - Axios (HTTP Client)                         |
        |                                                |
        |  State Management:                             |
        |  - Context API (AuthContext)                   |
        |  - User authentication state                   |
        +------------------------+-----------------------+
                                 |
                                 | HTTP/HTTPS + JWT Token
                                 | Authorization: Bearer <token>
                                 v
        +------------------------------------------------+
        |            BACKEND LAYER                       |
        |            Node.js + Express.js                |
        |                                                |
        |  Middleware Stack:                             |
        |  - CORS Handler                                |
        |  - JWT Verification                            |
        |  - Request Logger                              |
        |  - Error Handler                               |
        |  - Multer (File Upload)                        |
        |                                                |
        |  API Routes:                                   |
        |  - /api/auth (Registration & Login)            |
        |  - /api/transactions (CRUD operations)         |
        |  - /api/upload (File processing)               |
        |  - /api/insights (AI-generated advice)         |
        |  - /api/reports (Reports & CSV export)         |
        +------------+-------------------+---------------+
                     |                   |
                     v                   v
        +-----------------------+  +----------------------+
        |   DATABASE LAYER      |  |   AI SERVICES        |
        |   MongoDB Atlas       |  |   OpenAI GPT-4o-mini |
        |                       |  |                      |
        |  Collections:         |  |  Functions:          |
        |  - Users              |  |  - Text Extraction   |
        |  - Transactions       |  |  - Parsing           |
        |  - Insights           |  |  - Categorization    |
        |                       |  |  - Insight Gen       |
        |  Features:            |  |                      |
        |  - Indexed queries    |  |  Cost: 2 INR/user    |
        |  - Aggregation        |  |  Response: 5-10 sec  |
        |  - Validation         |  |                      |
        +-----------------------+  +----------------------+
```

---

## Security Architecture

### User Registration Flow

```
Plain Text Password
        |
        v
bcrypt.hash(password, 10 salt rounds)
        |
        v
Hashed Password stored in MongoDB
(Original password never stored)
```

### User Login Flow

```
User enters credentials
        |
        v
bcrypt.compare(plainPassword, hashedPassword)
        |
        +-- Match --> Generate JWT Token
        |             - Payload: userId, email
        |             - Expiration: 7 days
        |             |
        |             v
        |             Send token to frontend
        |             |
        |             v
        |             Store in localStorage
        |
        +-- No Match --> Return 401 Unauthorized
```

### Protected API Request Flow

```
Frontend sends request
        |
        v
Axios interceptor adds:
"Authorization: Bearer <token>"
        |
        v
Backend JWT middleware
        |
        v
jwt.verify(token, SECRET_KEY)
        |
        +-- Valid --> Decode payload
        |             |
        |             v
        |             Attach userId to req.user
        |             |
        |             v
        |             Process request
        |
        +-- Invalid --> Return 403 Forbidden
```

---

## File Upload and AI Processing Flow

```
Step 1: User uploads bank statement
        |
        v
Step 2: Frontend validates file
        - Type: PDF, CSV, or TXT
        - Size: Less than 10MB
        - Shows preview
        |
        v
Step 3: POST /api/upload (multipart/form-data)
        |
        v
Step 4: Multer middleware saves file
        -> /uploads/unique-filename.pdf
        |
        v
Step 5: Backend extracts text
        - PDF --> pdf-parse library
        - CSV --> csv-parser library
        - TXT --> fs.readFile
        |
        v
Step 6: Send extracted text to OpenAI API
        |
        v
Step 7: AI processes text (GPT-4o-mini)
        Prompt: "Parse this bank statement and extract:
                 - Date
                 - Description
                 - Amount
                 - Type (income/expense)
                 - Category"
        |
        v
Step 8: AI returns structured JSON
        [
          {
            date: "2024-01-15",
            description: "Grocery Store",
            amount: 2500,
            type: "expense",
            category: "Groceries"
          },
          ...
        ]
        |
        v
Step 9: Backend validates data
        - Check required fields
        - Validate date format
        - Ensure amount > 0
        - Sanitize strings
        |
        v
Step 10: Save transactions to MongoDB
        {
          userId,
          date,
          description,
          amount,
          type,
          category,
          source: "upload"
        }
        |
        v
Step 11: Generate AI insights (Second OpenAI call)
        Prompt: "Analyze these transactions and provide:
                 - Spending summary
                 - Top categories
                 - Budget recommendations
                 - Advice in Hinglish"
        |
        v
Step 12: Save insights to database
        |
        v
Step 13: Return response to frontend
        {
          success: true,
          transactions: [...],
          insights: {
            summary: "...",
            advice: "..."
          }
        }
        |
        v
Step 14: Frontend displays results
        - Transactions table
        - AI insights card
        - Updated charts
```

**Processing Time:** 5-10 seconds for typical statement

---

## Dashboard Data Flow

```
User logs in successfully
        |
        v
Redirect to /dashboard
        |
        v
Dashboard component mounts
        |
        v
useEffect() triggers parallel API calls
        |
        +-------+-------+-------+
        |       |       |       |
        v       v       v       v
      GET     GET     GET     GET
   /trans  /insights /summary /cats
        |
        v
Backend MongoDB aggregation pipeline
        |
        v
Transaction.aggregate([
  { $match: { userId: req.user._id } },
  { $group: { _id: "$category", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
])
        |
        v
Calculate metrics
        - Total Income = sum(type: "income")
        - Total Expenses = sum(type: "expense")
        - Net Balance = income - expenses
        - Category breakdown
        - Monthly trends
        |
        v
Return aggregated data to frontend
        |
        v
Frontend processes data
        - Format currency (INR)
        - Calculate percentages
        - Prepare chart data for Recharts
        |
        v
Render dashboard UI
        - Summary Cards (Income/Expense/Balance)
        - Pie Chart (Category distribution)
        - Line Chart (Monthly spending trend)
        - Recent Transactions Table
        - AI Insights Card (Hinglish advice)
```

---

## Transaction CRUD Operations

### CREATE
```
User clicks "Add Transaction"
        |
        v
Modal opens with form
        |
        v
Fill form fields:
        - Date
        - Description
        - Amount
        - Type (income/expense)
        - Category
        |
        v
POST /api/transactions
        |
        v
Backend validates and saves to MongoDB
        |
        v
Return new transaction
        |
        v
Frontend updates table and charts
```

### READ
```
GET /api/transactions
        |
        v
MongoDB query: Transaction.find({ userId: req.user._id })
        |
        v
Return transactions array
        |
        v
Display in table with filters
```

### UPDATE
```
User clicks "Edit" on transaction
        |
        v
Modal opens with pre-filled form
        |
        v
Modify fields
        |
        v
PUT /api/transactions/:id
        |
        v
Transaction.findByIdAndUpdate(id, updatedData)
        |
        v
Return updated transaction
        |
        v
Refresh UI
```

### DELETE
```
User clicks "Delete" on transaction
        |
        v
Confirmation dialog
        |
        v
DELETE /api/transactions/:id
        |
        v
Transaction.findByIdAndDelete(id)
        |
        v
Return success message
        |
        v
Remove from UI and recalculate charts
```

---

## Reports and Export Flow

```
User navigates to /reports
        |
        v
Select filters:
        - Date range (Start date to End date)
        - Category (Groceries, Transport, etc.)
        - Type (Income or Expense)
        |
        v
Apply filters
        |
        v
GET /api/reports?startDate=2024-01-01&endDate=2024-12-31&category=groceries
        |
        v
Backend MongoDB aggregation with match filters
        |
        v
Calculate statistics:
        - Total spent per category
        - Daily/Weekly/Monthly trends
        - Average transaction amount
        - Top spending days
        |
        v
Return report data
        |
        v
Frontend renders:
        - Summary statistics
        - Bar charts (category comparison)
        - Line charts (time-based trends)
        - Detailed transactions list
        |
        v
User clicks "Export CSV"
        |
        v
Frontend formats data as CSV
        |
        v
Create Blob object
        |
        v
Trigger browser download
        |
        v
File saved: transactions_report_2024.csv
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User, indexed),
  date: Date,
  description: String,
  amount: Number,
  type: String (enum: ['income', 'expense']),
  category: String,
  source: String (enum: ['upload', 'manual']),
  createdAt: Date,
  updatedAt: Date
}
```

### Insights Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  summary: String,
  advice: String,
  generatedAt: Date,
  transactionCount: Number
}
```

**Database Indexes:**
- users.email (unique)
- transactions.userId
- transactions.date

---

## API Endpoints Reference

### Authentication Endpoints
- POST /api/auth/register - Create new user account
- POST /api/auth/login - Authenticate user and return JWT
- GET /api/auth/me - Get current user information

### Transaction Endpoints
- GET /api/transactions - Retrieve all user transactions
- POST /api/transactions - Create new transaction
- PUT /api/transactions/:id - Update existing transaction
- DELETE /api/transactions/:id - Delete transaction

### Upload Endpoint
- POST /api/upload - Upload and parse bank statement

### Insights Endpoints
- GET /api/insights - Retrieve AI-generated insights
- POST /api/insights/generate - Generate new insights

### Reports Endpoints
- GET /api/reports - Get filtered transaction reports
- GET /api/reports/export - Export data as CSV file

---

## Deployment Architecture

```
Developer Machine
        |
        v
git commit and push
        |
        v
GitHub Repository
        |
        +-------------+
        |             |
        v             v
    FRONTEND      BACKEND
    (React)       (Node.js)
        |             |
        v             v
npm run build     Deploy to
(Vite bundler)    Render
        |             |
        v             v
Production build  API live at:
created           api.domain.com
        |             |
        v             v
Deploy to Vercel  Connected to
        |         MongoDB Atlas
        v             |
Live at:              v
app.domain.com    Cloud Database
                  (Auto-scaled)
```

**Environment Variables:**

Frontend (.env):
- VITE_API_URL

Backend (.env):
- MONGO_URI
- JWT_SECRET
- OPENAI_API_KEY

---

## Key Features

1. **AI-Powered Parsing**
   - Automatically extracts transactions from bank statements
   - Supports PDF, CSV, and TXT formats

2. **Smart Insights**
   - GPT-4o-mini generates personalized financial advice
   - Recommendations provided in Hinglish

3. **Visual Analytics**
   - Interactive charts using Recharts library
   - Real-time spending pattern visualization

4. **Multi-Format Support**
   - Handles PDF, CSV, and TXT file formats
   - Automatic format detection and processing

5. **Secure Authentication**
   - JWT token-based authentication
   - bcrypt password hashing with salt rounds

6. **CSV Export**
   - Download transaction reports as CSV files
   - Customizable date range and filters

7. **Responsive Design**
   - Tailwind CSS for mobile and desktop compatibility
   - Optimized user interface across devices

8. **Real-time Updates**
   - Instant UI refresh after operations
   - No page reload required for updates

---

## Performance Metrics

- Statement Processing Time: 5-10 seconds
- Dashboard Load Time: Less than 1 second
- API Response Time: Less than 200 milliseconds
- Database Query Time: Less than 100 milliseconds
- AI API Cost: Approximately 2 INR per user per month

---

## Future Enhancements

- Budget goal tracking with notifications
- Multi-currency support (USD, EUR, GBP)
- Bill payment reminders
- Investment portfolio tracking
- Mobile application (React Native)
- Email and SMS notifications
- Recurring transaction auto-detection
- Advanced machine learning spending predictions
- Direct bank API integration
- Multi-language support

---

## Technology Documentation References

- React: https://react.dev
- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- OpenAI API: https://platform.openai.com/docs
- JWT: https://jwt.io
- Tailwind CSS: https://tailwindcss.com

---

**Built with React, Node.js, MongoDB and OpenAI**