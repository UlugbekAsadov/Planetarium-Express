const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("../middlewares/error");
const path = require("path");
const app = express();
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, "../public")));

// Auth routes
app.use("/api/v1/auth", require("../routes/auth/auth.route"));

// Users routes
app.use("/api/v1/users", require("../routes/users/users.route"));

// Stars routes
app.use("/api/v1/stars", require("../routes/stars/stars.route"));

// Planets routes
app.use("/api/v1/planets", require("../routes/planets/planets.route"));

// Error handler
app.use(errorHandler);

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connection to DB
connectDB();
app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`.bgGreen)
);
