# SQL Editor - Interactive SQL Learning Platform

A full-stack web application for learning and practicing SQL queries with real-time validation and feedback.

![SQL Editor](https://img.shields.io/badge/SQL-Editor-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?logo=postgresql)

## 🚀 Features

- **Interactive SQL Editor** with Monaco Editor (VS Code editor)
- **Real-time Query Validation** - Instant feedback on query correctness
- **Multiple Assignments** - Practice different SQL concepts
- **Live Query Execution** - Run queries against real databases
- **Responsive Design** - Works on desktop and mobile
- **Clean UI** - Minimal, focused interface for learning

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Monaco Editor** - Professional code editor
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **Vanilla CSS** - Custom styling without frameworks

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Assignment storage
- **PostgreSQL** - Query execution sandbox
- **Mongoose** - MongoDB ODM

## 📁 Project Structure

```
SQL_Editor/
├── Frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS stylesheets
│   │   └── config/         # Configuration files
│   ├── dist/               # Production build
│   └── package.json
├── Backend/                 # Node.js backend API
│   ├── controller/         # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── database/          # Database connections
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account or local MongoDB
- PostgreSQL database

### 1. Clone Repository
```bash
git clone https://github.com/nileshgithub74/Sql_editor.git
cd Sql_editor
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create `.env` file:
```env
PORT=8080
MONGODB_URL=your_mongodb_connection_string
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=your_database_name
PG_USER=your_username
PG_PASSWORD=your_password
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

Start frontend:
```bash
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## 📚 How It Works

1. **Choose Assignment** - Select from available SQL practice problems
2. **Write Query** - Use the Monaco editor to write SQL queries
3. **Execute** - Click "Run" to execute your query
4. **Get Feedback** - See if your query is correct with instant validation
5. **View Results** - See the actual data returned by your query

## 🎯 Assignment Types

- **Basic SELECT** - Learn fundamental SELECT queries
- **WHERE Filtering** - Practice conditional filtering
- **JOIN Operations** - Master table relationships
- **Aggregate Functions** - Work with COUNT, SUM, AVG, etc.

## 🔧 API Endpoints

### Assignments
- `GET /api/assignment` - Get all assignments
- `GET /api/assignment/:id` - Get specific assignment

### SQL Execution
- `POST /api/sql/assignment/load` - Load assignment data
- `POST /api/sql/query/execute` - Execute SQL query
- `POST /api/sql/query/validate` - Validate query results

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Nilesh Kumar**
- GitHub: [@nileshgithub74](https://github.com/nileshgithub74)

## 🙏 Acknowledgments

- Monaco Editor for the excellent code editor
- React team for the amazing framework
- Express.js for the robust backend framework

---

⭐ Star this repository if you found it helpful!
