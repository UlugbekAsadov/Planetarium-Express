const mongoose = require("mongoose");

const connectDB = async () => {
  const connecting = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Mongo DB connected to: ${connecting.connection.host}` .bgGreen);
};

module.exports = connectDB;
