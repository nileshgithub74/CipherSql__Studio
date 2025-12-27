import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./database/db.js";
dotenv.config();
import assignmentRoutes from "./routes/assignmentRoutes.js";
import sqlRoutes from "./routes/sqlRoutes.js";

const app = express();

const port = process.env.PORT || 8080;

// middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Database connection
ConnectDB();

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "SQL Editor Backend API is running!",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});



//routes
app.use("/api/assignment", assignmentRoutes);
app.use("/api/sql", sqlRoutes);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
