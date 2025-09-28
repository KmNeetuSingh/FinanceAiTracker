# Finance AI Tracker Application Flow

This document outlines the architecture and data flow of the Finance AI Tracker application, which consists of a React-based frontend and a Node.js/Express backend.

## 1. Frontend Overview

The frontend is built with React and uses `react-router-dom` for navigation and `AuthContext` for authentication state management. It communicates with the backend via Axios.

**Key Frontend Components and Pages:**

*   **`App.jsx`**: Sets up the main routing and `AuthProvider`.
*   **`AuthContext.jsx`**: Manages user authentication state, including login, registration, and logout. Stores JWT tokens and user information in `localStorage`.
*   **`api.js`**: Centralized module for all API calls to the backend using Axios. It includes an interceptor to automatically attach the JWT token to authenticated requests.
    *   `authAPI`: Handles user authentication (login, register).
    *   `transactionsAPI`: Manages all transaction-related operations (fetch, create, update, delete, upload statements, get dashboard summary).
    *   `usersAPI`: Handles user profile operations.
*   **Pages**:
    *   `Home.jsx`: Landing page.
    *   `Login.jsx`, `Register.jsx`: User authentication.
    *   `Dashboard.jsx`, `Upload.jsx`, `Report.jsx`, `Settings.jsx`: Protected routes requiring authentication.
*   **Components**: `ProtectedRoute.jsx` ensures only authenticated users access protected content. `Layout.jsx` provides a consistent layout for authenticated sections. Specific functionality is handled by components like `UploadArea.jsx`, `TransactionsTable.jsx`, `SummaryCard.jsx`, and `ExpensesChart.jsx`.

## 2. Backend Overview

The backend is built with Node.js and Express, connecting to a MongoDB database. It exposes RESTful APIs for authentication, transaction management, file uploads, and AI processing.

**Key Backend Technologies and Components:**

*   **Database**: **MongoDB** (connected via `mongoose`).
*   **LLM Used**: **OpenAI's gpt-4o-mini** is used for AI functionalities.
*   **`server.js`**: The main entry point for the backend. It initializes Express, sets up middleware (CORS, JSON body parsing), connects to MongoDB, and defines API routes.
*   **`db.js`**: Contains the MongoDB connection logic using Mongoose.
*   **`middleware/auth.js`**: An Express middleware that verifies JSON Web Tokens (JWT) to protect routes, ensuring only authenticated users can access certain endpoints.
*   **`model/User.js`**: Mongoose schema and model for user data, including password hashing.
*   **`model/Transaction.js`**: Mongoose schema and model for financial transaction data.

## 3. Core Application Flow

### 3.1. User Authentication (Login/Registration)

1.  **Frontend**: User interacts with `Login.jsx` or `Register.jsx`.
2.  **Frontend (`api.js`)**: Sends credentials/user data to `backend/api/auth/login` or `backend/api/auth/register`.
3.  **Backend (`routes/auth.js`)**:
    *   **Registration**: Creates a new user in MongoDB (`User.js` model), hashes the password, and generates a JWT.
    *   **Login**: Authenticates the user against MongoDB, verifies the password, and generates a JWT.
4.  **Backend**: Returns a JWT and user information.
5.  **Frontend (`AuthContext.jsx`)**: Stores the JWT and user data in `localStorage` and updates the application's authentication state.

### 3.2. Bank Statement Upload and AI Processing

1.  **Frontend (`Upload.jsx`)**: User uploads a bank statement file (PDF, CSV, or TXT).
2.  **Frontend (`api.js`)**: Sends the file as `multipart/form-data` to `backend/api/upload`.
3.  **Backend (`routes/upload.js`)**:
    *   Uses `multer` (`utils/fileUpload.js`) to handle the file upload and save it temporarily.
    *   `utils/fileUpload.js`: Extracts text content from the uploaded file. For PDFs, it also attempts to validate if it's a bank statement.
    *   `utils/aiParser.js`: Calls **OpenAI's gpt-4o-mini** with the extracted text content. The AI analyzes the statement and extracts structured transaction data (date, amount, description, merchant, category, type) in JSON format. It includes robust validation and data-fixing for the extracted transactions.
    *   **Database**: The extracted and validated transactions are then saved to **MongoDB** under the `Transaction.js` model, associated with the authenticated user.
    *   `utils/aiService.js`: Calculates financial summaries (total income, total expenses, category-wise breakdown) from the saved transactions. It then uses **OpenAI's gpt-4o-mini** to generate a personalized, actionable financial message in Hinglish.
4.  **Backend**: Returns the saved transactions and the financial summary/message to the frontend.
5.  **Frontend (`Upload.jsx`, `Dashboard.jsx`)**: Displays the newly added transactions and the AI-generated financial insights.

### 3.3. Transaction Management and Reporting

1.  **Frontend (`Dashboard.jsx`, `Reports.jsx`, `TransactionsTable.jsx`)**: User views, filters, updates, or deletes transactions.
2.  **Frontend (`api.js`)**: Makes authenticated API calls to `backend/api/transactions` for:
    *   Fetching all transactions (with pagination and filtering options).
    *   Getting dashboard summaries (total income, expenses, category breakdown).
    *   Updating or deleting specific transactions.
    *   Downloading transactions as a CSV report.
3.  **Backend (`routes/transactions.js`)**:
    *   Utilizes the `auth` middleware to ensure the user is authenticated.
    *   Performs CRUD operations on the `Transaction` collection in **MongoDB**.
    *   Calculates and returns financial summaries for the dashboard.
    *   Generates and serves CSV files for transaction reports.


