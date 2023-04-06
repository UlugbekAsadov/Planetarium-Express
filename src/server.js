const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const morgan = require("morgan");
const colors = require("colors");

const app = express();
dotenv.config();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connection to DB
connectDB();
app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}` .bgGreen )
);
