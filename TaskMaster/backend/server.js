// Import required packages and modules
require("dotenv").config();
const express = require("express");
const mongoose = require(`mongoose`);
const cors = require("cors");

const app = express();
const cookieParser = require(`cookie-parser`);

// Importing the routes
const authRoutes = require(`./routes/authRoutes`);
const taskBoardRoutes = require(`./routes/taskBoardRoutes`);
const taskRoutes = require(`./routes/taskRoutes`);
const adminRoutes = require(`./routes/adminRoutes`);

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Middleware to log requests in console
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Using the Routes
app.use(`/auth`, authRoutes);
app.use(`/taskBoard`, taskBoardRoutes);
app.use(`/tasks`, taskRoutes);
app.use(`/admin`, adminRoutes);

// Connect to db
mongoose
    .connect(process.env.REACT_APP_MONGODB_URI)
    .then(() => {
        // Environment variable instead of hardcoding the port
        app.listen(process.env.PORT, () => {
            console.log(`Connected to db and listening on port`, process.env.PORT);
        });
    })
    // Handle errors
    .catch((err) => {
        console.log(err);
    });
