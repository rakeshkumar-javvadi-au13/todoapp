const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todos");
const { requireAuth } = require("./middleware/auth");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(cors());

app.use(bodyParser.json());
// Routes
console.log("rakesh")
app.use("/auth", authRoutes);
app.use("/todos", requireAuth, todoRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
