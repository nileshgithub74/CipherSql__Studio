# CipherSQL Studio

A comprehensive SQL learning platform with interactive query execution, user authentication, and real-time feedback.

## 🚀 Features



### SQL Learning Platform
- **Interactive SQL Editor** with Monaco Editor
- **Real-time Query Execution** against PostgreSQL databases
- **Assignment Management** with difficulty levels
- **Intelligent Hints** and answer validation
- **Schema Visualization** for database understanding
- **Results Display** with formatted output

### Technical Stack
- **Frontend**: React 19, Vite, React Router DOM, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, MongoDB (users), PostgreSQL (queries)
- **Authentication**: JWT tokens, bcryptjs password hashing
- **Database**: Hybrid approach - MongoDB for users, PostgreSQL for SQL execution

## 📁 Project Structure

```
CipherSQL-Studio/
├── Backend/                 # Node.js Express API
│   ├── controller/         # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── database/          # Database connections
│   └── server.js          # Entry point
├── Frontend/              # React application
│   ├── src/
│   │   ├── component/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # CSS files
│   │   ├── config/        # Configuration
│   │   └── App.jsx        # Main app component
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- PostgreSQL database
- npm or yarn package manager

### Backend Setup

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create `.env` file with:
   ```env
   PORT=8080
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   
   # PostgreSQL Configuration
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=your_database_name
   PG_USER=your_username
   PG_PASSWORD=your_password
   ```

4. **Start Backend Server:**
   ```bash
   npm run dev
   ```
   Server runs on: http://localhost:8080

### Frontend Setup

1. **Navigate to Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create `.env` file with:
   ```env
   VITE_API_URL=http://localhost:8080
   ```

4. **Start Frontend Server:**
   ```bash
   npm run dev
   ```
   Application runs on: http://localhost:5173



### Assignment Routes
- `GET /api/assignment` - Get all assignments
- `GET /api/assignment/:id` - Get assignment by ID

### SQL Execution Routes
- `POST /api/sql/execute` - Execute SQL query
- `POST /api/sql/validate` - Validate SQL answer
- `GET /api/sql/hints/:id` - Get hints for assignment

## 🎯 Usage

### For Users
1. **Register/Login**: Create account or sign in at `/register` or `/login`
2. **Browse Assignments**: View available SQL challenges at `/assignments`
3. **Practice SQL**: Select an assignment and start coding
4. **Get Feedback**: Receive hints and validation for your queries
5. **Track Progress**: Monitor your learning journey

### For Developers
1. **Add Assignments**: Create new SQL challenges in the database
2. **Customize UI**: Modify React components and styles
3. **Extend API**: Add new endpoints in the Express backend
4. **Database Management**: Manage users in MongoDB and queries in PostgreSQL

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds = 12
- **JWT Authentication**: Secure token-based sessions
- **Input Validation**: Email format and password strength validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set environment variables in production
- Use MongoDB Atlas for database hosting
- Configure PostgreSQL connection for production

### Frontend Deployment
- Build for production: `npm run build`
- Deploy to Vercel, Netlify, or similar platforms
- Update API URL for production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Kumar Nilesh** - Initial development and authentication syst

