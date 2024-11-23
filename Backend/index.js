const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const taskRoutes = require("./routes/tasks");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
mongoose
    .connect("mongodb://127.0.0.1:27017/todolist", )
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("Database connection error:", error));

// Routes
app.use("/api/tasks", taskRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
