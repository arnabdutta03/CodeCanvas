const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DB)
  .then(() => console.log("MongoDB Connection successfull!"))
  .catch((err) => console.error("Connection error:", err.message));
