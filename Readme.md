# 📊 Finance AI Tracker - Project Flow Documentation

## Live Demo

https://github.com/user-attachments/assets/936eb0c3-77ed-4ab0-b0de-2bfa7e46b9e2

## Overview

Finance AI Tracker is a full-stack FinTech application that leverages AI to help users manage their finances by uploading bank statements, getting automated insights, and tracking their financial health.

---

## 🏗️ Architecture Stack

### Frontend

- **Framework**: React 18
- **Routing**: React Router DOM
- **State Management**: Context API (AuthContext)
- **HTTP Client**: Axios with JWT interceptors
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Build Tool**: Vite

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Processing**: Multer for uploads
- **AI Integration**: OpenAI GPT-4o-mini
- **Security**: bcryptjs for password hashing

---

## 🔄 Application Flow

### 1. User Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. Visit /login or /register
       ▼
┌─────────────────────┐
│  Auth Pages         │
│  - Login Form       │
│  - Register Form    │
└──────┬──────────────┘
       │
       │ 2. Submit credentials
       ▼
┌─────────────────────────────┐
│  Frontend (Axios)           │
│  POST /api/auth/login       │
│  POST /api/auth/register    │
└──────┬──────────────────────┘
       │
       │ 3. HTTP Request with credentials
       ▼
┌─────────────────────────────┐
│  Backend API                │
│  - Validate credentials     │
│  - Hash password (register) │
│  - Compare hash (login)     │
└──────┬──────────────────────┘
       │
       │ 4. Query MongoDB
       ▼
┌─────────────────────┐
│  MongoDB            │
│  Users Collection   │
└──────┬──────────────┘
       │
       │ 5. Return user data
       ▼
┌─────────────────────────────┐
│  Backend Response           │
│  - Generate JWT token       │
│  - Send user data + token   │
└──────┬──────────────────────┘
       │
       │ 6. Response with JWT
       ▼
┌─────────────────────────────┐
│  Frontend (AuthContext)     │
│  - Store JWT in localStorage│
│  - Update auth state        │
│  - Redirect to /dashboard   │
└─────────────────────────────┘
```

**Key Steps:**

1. User navigates to login/register page
2. Submits credentials via form
3. Frontend sends POST request to backend
4. Backend validates and queries MongoDB
5. On success, JWT token is generated
6. Frontend stores token and updates authentication state
7. User is redirected to dashboard

---

### 2. Bank Statement Upload & AI Processing Flow

```
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       │ 1. Navigate to Upload page
       ▼
┌─────────────────────────┐
│  Upload Component       │
│  - Drag & Drop Area     │
│  - File Selector        │
│  - Supported: PDF,      │
│    CSV, TXT             │
└──────┬──────────────────┘
       │
       │ 2. User selects/drops file
       ▼
┌─────────────────────────────┐
│  Frontend Validation        │
│  - Check file type          │
│  - Check file size          │
│  - Preview file name        │
└──────┬──────────────────────┘
       │
       │ 3. Upload file (multipart/form-data)
       ▼
┌─────────────────────────────┐
│  Backend API                │
│  POST /api/upload           │
│  Headers: Authorization JWT │
└──────┬──────────────────────┘
       │
       │ 4. Multer middleware processes file
       ▼
┌─────────────────────────────┐
│  File Storage               │
│  - Save to /uploads folder  │
│  - Generate unique filename │
└──────┬──────────────────────┘
       │
       │ 5. Extract text content
       ▼
┌─────────────────────────────┐
│  Text Extraction Module     │
│  - PDF: pdf-parse           │
│  - CSV: csv-parser          │
│  - TXT: fs.readFile         │
└──────┬──────────────────────┘
       │
       │ 6. Send extracted text to AI
       ▼
┌─────────────────────────────┐
│  OpenAI API Integration     │
│  Model: gpt-4o-mini         │
│                             │
│  Prompt Engineering:        │
│  "Parse this bank statement │
│   and extract:              │
│   - Date                    │
│   - Description             │
│   - Amount                  │
│   - Type (debit/credit)     │
│   - Category"               │
└──────┬──────────────────────┘
       │
       │ 7. AI returns structured JSON
       ▼
┌─────────────────────────────┐
│  Data Validation            │
│  - Verify required fields   │
│  - Sanitize data            │
│  - Check data types         │
│  - Assign userId            │
└──────┬──────────────────────┘
       │
       │ 8. Save to database
       ▼
┌─────────────────────────────┐
│  MongoDB                    │
│  Transactions Collection    │
│  {                          │
│    userId: ObjectId,        │
│    date: Date,              │
│    description: String,     │
│    amount: Number,          │
│    type: String,            │
│    category: String         │
│  }                          │
└──────┬──────────────────────┘
       │
       │ 9. Generate AI insights
       ▼
┌─────────────────────────────┐
│  OpenAI Insights Generator  │
│                             │
│  Analyze transactions:      │
│  - Spending patterns        │
│  - Category breakdown       │
│  - Budget recommendations   │
│  - Hinglish advice          │
└──────┬──────────────────────┘
       │
       │ 10. Return response
       ▼
┌─────────────────────────────┐
│  Backend Response           │
│  {                          │
│    success: true,           │
│    transactions: [...],     │
│    insights: {              │
│      summary: "...",        │
│      advice: "..."          │
│    }                        │
│  }                          │
└──────┬──────────────────────┘
       │
       │ 11. Display results
       ▼
┌─────────────────────────────┐
│  Frontend UI Update         │
│  - Show success message     │
│  - Display transactions     │
│    table                    │
│  - Render AI insights card  │
│  - Update dashboard charts  │
└─────────────────────────────┘
```

**Key Steps:**

1. User uploads bank statement file (PDF/CSV/TXT)
2. Frontend validates file type and size
3. File sent to backend via multipart form
4. Multer saves file to server storage
5. Backend extracts text from file
6. Extracted text sent to OpenAI for parsing
7. AI returns structured transaction data
8. Data validated and sanitized
9. Transactions saved to MongoDB with user reference
10. AI generates financial insights and advice
11. Response sent back with transactions and insights
12. Frontend displays parsed data and AI recommendations

---

### 3. Dashboard & Analytics Flow

```
┌─────────────┐
│  User Login │
└──────┬──────┘
       │
       │ 1. Redirect to dashboard
       ▼
┌─────────────────────────────┐
│  Dashboard Component        │
│  useEffect() triggered      │
└──────┬──────────────────────┘
       │
       │ 2. Fetch dashboard data
       ▼
┌─────────────────────────────┐
│  API Calls (Parallel)       │
│  GET /api/transactions      │
│  GET /api/insights          │
│  GET /api/summary           │
└──────┬──────────────────────┘
       │
       │ 3. Backend processes requests
       ▼
┌─────────────────────────────┐
│  MongoDB Aggregation        │
│  Pipeline:                  │
│  - Filter by userId         │
│  - Group by category        │
│  - Calculate totals         │
│  - Sort by date             │
└──────┬──────────────────────┘
       │
       │ 4. Return aggregated data
       ▼
┌─────────────────────────────┐
│  Frontend Data Processing   │
│  - Calculate totals         │
│  - Prepare chart data       │
│  - Format currency          │
│  - Group by time period     │
└──────┬──────────────────────┘
       │
       │ 5. Render dashboard
       ▼
┌─────────────────────────────┐
│  Dashboard UI Components    │
│                             │
│  📊 Summary Cards           │
│  ├─ Total Income            │
│  ├─ Total Expenses          │
│  └─ Net Balance             │
│                             │
│  📈 Charts (Recharts)       │
│  ├─ Expense Pie Chart       │
│  ├─ Income vs Expense       │
│  └─ Monthly Trends          │
│                             │
│  📋 Recent Transactions     │
│  └─ TransactionsTable       │
│                             │
│  💡 AI Insights Card        │
│  └─ Hinglish Advice         │
└─────────────────────────────┘
```

**Key Steps:**

1. Dashboard loads on successful login
2. Multiple API calls fetch user data
3. Backend aggregates transactions from MongoDB
4. Data processed for visualization
5. Charts and tables rendered with real-time data
6. AI insights displayed for financial guidance

---

### 4. Transaction Management Flow

```
┌─────────────────┐
│  Transactions   │
│  Page           │
└────────┬────────┘
         │
         ├─────── CREATE ──────┐
         │                     │
         │                     ▼
         │              ┌─────────────────┐
         │              │  Add Transaction│
         │              │  Modal/Form     │
         │              └────────┬────────┘
         │                       │
         │                       │ POST /api/transactions
         │                       ▼
         │              ┌─────────────────┐
         │              │  Backend        │
         │              │  - Validate     │
         │              │  - Save to DB   │
         │              └────────┬────────┘
         │                       │
         ├─────── READ ──────────┤
         │                       │
         │  GET /api/transactions│
         │                       │
         │         ┌─────────────▼────────┐
         │         │  MongoDB Query       │
         │         │  - Filter by userId  │
         │         │  - Sort & paginate   │
         │         └─────────────┬────────┘
         │                       │
         ├─────── UPDATE ────────┤
         │                       │
         │  PUT /api/transactions/:id
         │                       │
         │         ┌─────────────▼────────┐
         │         │  Update Document     │
         │         │  findByIdAndUpdate() │
         │         └─────────────┬────────┘
         │                       │
         └─────── DELETE ────────┤
                                 │
            DELETE /api/transactions/:id
                                 │
                   ┌─────────────▼────────┐
                   │  Remove Document     │
                   │  findByIdAndDelete() │
                   └─────────────┬────────┘
                                 │
                                 ▼
                   ┌─────────────────────┐
                   │  Frontend Update    │
                   │  - Refresh table    │
                   │  - Update charts    │
                   │  - Show toast       │
                   └─────────────────────┘
```

**CRUD Operations:**

- **Create**: Add new transaction manually
- **Read**: Fetch and display all transactions
- **Update**: Edit transaction details
- **Delete**: Remove transaction from database

---

### 5. Reports & Export Flow

```
┌─────────────┐
│  Reports    │
│  Page       │
└──────┬──────┘
       │
       │ 1. Select filters
       ▼
┌─────────────────────────────┐
│  Filter Options             │
│  - Date Range Picker        │
│  - Category Selector        │
│  - Type Filter (Income/     │
│    Expense)                 │
└──────┬──────────────────────┘
       │
       │ 2. Apply filters
       ▼
┌─────────────────────────────┐
│  API Request                │
│  GET /api/reports           │
│  ?startDate=2024-01-01      │
│  &endDate=2024-12-31        │
│  &category=groceries        │
└──────┬──────────────────────┘
       │
       │ 3. Backend processing
       ▼
┌─────────────────────────────┐
│  MongoDB Aggregation        │
│  - Match filters            │
│  - Group by category/date   │
│  - Calculate statistics     │
│  - Generate insights        │
└──────┬──────────────────────┘
       │
       │ 4. Render report
       ▼
┌─────────────────────────────┐
│  Report Visualization       │
│  - Summary Statistics       │
│  - Category Breakdown       │
│  - Trend Analysis           │
│  - Export Button            │
└──────┬──────────────────────┘
       │
       │ 5. User clicks export
       ▼
┌─────────────────────────────┐
│  Export Handler             │
│  - Format data as CSV       │
│  - Create Blob              │
│  - Trigger download         │
└──────┬──────────────────────┘
       │
       │ 6. Download file
       ▼
┌─────────────────────────────┐
│  CSV File Downloaded        │
│  transactions_report.csv    │
└─────────────────────────────┘
```

**Key Steps:**

1. User selects report filters (date, category, type)
2. Filtered API request sent to backend
3. MongoDB aggregates data based on filters
4. Report rendered with charts and statistics
5. User exports data as CSV
6. File downloaded to local machine

---

## 🔐 Security Implementation

### Authentication & Authorization

```
┌─────────────────────────────┐
│  Protected Route Request    │
└──────┬──────────────────────┘
       │
       │ 1. Check localStorage for JWT
       ▼
┌─────────────────────────────┐
│  Frontend Route Guard       │
│  <ProtectedRoute>           │
│  - Token exists?            │
│  - Token valid format?      │
└──────┬──────────────────────┘
       │
       ├─── NO TOKEN ───┐
       │                │
       │                ▼
       │      ┌─────────────────┐
       │      │  Redirect to    │
       │      │  /login         │
       │      └─────────────────┘
       │
       ├─── HAS TOKEN ──┐
       │                │
       │                ▼
       │      ┌─────────────────────┐
       │      │  Axios Interceptor  │
       │      │  Add Authorization: │
       │      │  Bearer <token>     │
       │      └──────────┬──────────┘
       │                 │
       │                 ▼
       │      ┌─────────────────────┐
       │      │  Backend Middleware │
       │      │  - Extract token    │
       │      │  - Verify signature │
       │      │  - Check expiry     │
       │      │  - Decode payload   │
       │      └──────────┬──────────┘
       │                 │
       │      ┌──────────┴──────────┐
       │      │                     │
       ▼      ▼                     ▼
  ┌────────────┐           ┌──────────────┐
  │  Invalid   │           │  Valid Token │
  │  Token     │           │  - Attach    │
  │  Return    │           │    userId to │
  │  401       │           │    req       │
  └────────────┘           │  - Continue  │
                           └──────────────┘
```

**Security Features:**

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes with middleware
- Token expiration handling
- Secure HTTP-only practices

---

## 📱 Component Architecture

### Frontend Components Hierarchy

```
App
├── AuthProvider (Context)
│   └── AuthContext
│       ├── user
│       ├── token
│       ├── login()
│       ├── logout()
│       └── register()
│
├── Router
│   ├── Public Routes
│   │   ├── /login → Login
│   │   └── /register → Register
│   │
│   └── Protected Routes (ProtectedRoute wrapper)
│       ├── /dashboard → Dashboard
│       │   ├── SummaryCards
│       │   ├── ExpensesChart
│       │   └── RecentTransactions
│       │
│       ├── /upload → Upload
│       │   ├── UploadArea
│       │   ├── FilePreview
│       │   └── InsightsDisplay
│       │
│       ├── /transactions → Transactions
│       │   ├── TransactionsTable
│       │   ├── FilterBar
│       │   └── TransactionModal
│       │
│       ├── /reports → Reports
│       │   ├── FilterOptions
│       │   ├── ReportCharts
│       │   └── ExportButton
│       │
│       └── /settings → Settings
│           ├── ProfileSection
│           ├── SecuritySection
│           └── PreferencesSection
│
└── Common Components
    ├── Layout
    │   ├── Navbar
    │   ├── Sidebar
    │   └── Footer
    ├── Button
    ├── Input
    ├── Modal
    └── LoadingSpinner
```

---

## 🗄️ Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Transactions Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
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
  userId: ObjectId (ref: User),
  summary: String,
  advice: String,
  generatedAt: Date,
  transactionCount: Number
}
```

---

## 🚀 Deployment Flow

```
┌─────────────────┐
│  Developer      │
│  Commits Code   │
└────────┬────────┘
         │
         │ git push
         ▼
┌─────────────────┐
│  GitHub Repo    │
└────────┬────────┘
         │
         ├─── Frontend ────┐
         │                 │
         │                 ▼
         │    ┌─────────────────────┐
         │    │  Build Process      │
         │    │  npm run build      │
         │    │  - Vite bundler     │
         │    │  - Optimize assets  │
         │    └──────────┬──────────┘
         │               │
         │               ▼
         │    ┌─────────────────────┐
         │    │  Deploy to Vercel/  │
         │    │  Netlify            │
         │    └─────────────────────┘
         │
         └─── Backend ─────┐
                           │
                           ▼
              ┌─────────────────────┐
              │  Deploy to          │
              │  - Render           │
              │  - Railway          │
              │  - Heroku           │
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  MongoDB Atlas      │
              │  (Cloud Database)   │
              └─────────────────────┘
```

---

## 🔧 API Endpoints Reference

### Authentication

- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Transactions

- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Upload

- `POST /api/upload` - Upload bank statement

### Insights

- `GET /api/insights` - Get AI-generated insights
- `POST /api/insights/generate` - Generate new insights

### Reports

- `GET /api/reports` - Get filtered reports
- `GET /api/reports/export` - Export as CSV

---

## 🎯 Key Features Summary

1. **AI-Powered Parsing**: Automatically extracts transactions from bank statements
2. **Smart Insights**: GPT-4o-mini generates financial advice in Hinglish
3. **Visual Analytics**: Interactive charts for spending patterns
4. **Multi-Format Support**: Handles PDF, CSV, and TXT files
5. **Secure Authentication**: JWT-based auth system
6. **Export Functionality**: Download reports as CSV
7. **Responsive Design**: Works on desktop and mobile
8. **Real-time Updates**: Instant UI updates after actions

---

## 🛠️ Development Workflow

```
Developer Workflow:

1. Clone Repository
   ↓
2. Install Dependencies
   - npm install (Frontend)
   - npm install (Backend)
   ↓
3. Configure Environment
   - .env files setup
   - MongoDB connection
   - OpenAI API key
   ↓
4. Run Development Servers
   - Frontend: npm run dev (Port 5173)
   - Backend: npm start (Port 5000)
   ↓
5. Make Changes
   - Edit components/routes
   - Test features
   ↓
6. Commit & Push
   - Git workflow
   ↓
7. Deploy
   - Frontend: Auto-deploy
   - Backend: Auto-deploy
```

---

## 📊 Data Flow Summary

```
User → Frontend → API → Backend → Database
                          ↓
                      OpenAI API
                          ↓
                    Insights Generated
                          ↓
                    Response to Frontend
                          ↓
                    UI Update → User Sees Result
```

---

## 🎓 Learning Resources

- **React Documentation**: https://react.dev
- **Express.js Guide**: https://expressjs.com
- **MongoDB Manual**: https://docs.mongodb.com
- **OpenAI API Docs**: https://platform.openai.com/docs
- **JWT Best Practices**: https://jwt.io

---

## 📝 Future Enhancements

- [ ] Budget goal tracking
- [ ] Multi-currency support
- [ ] Bill payment reminders
- [ ] Investment portfolio tracking
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Recurring transaction detection
- [ ] Advanced ML predictions

---

**Made with ❤️ using React, Node.js, MongoDB & OpenAI**
