import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ConnectDB from "./database/db.js";
dotenv.config();
import assignmentRoutes from "./routes/assignmentRoutes.js";
import sqlRoutes from "./routes/sqlRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import hintRoutes from "./routes/hintRoutes.js";

const app = express();

const port = process.env.PORT || 8080;

// middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Database connection
ConnectDB();


app.get("/", (req, res) => {
  res.json({ 
    message: "SQL Editor Backend API is running!",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});



//routes
app.use("/api/auth", authRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/sql", sqlRoutes);
app.use("/api/hint", hintRoutes);




app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
