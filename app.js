const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes.js");
const officerRoutes = require("./routes/officerRoutes.js");
const clientRoutes = require("./routes/clientRoutes.js");
const callRoutes = require("./routes/callRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes.js");
const { createLogger } = require("logger"); // Commented, see note below

// Logs directory setup
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Logger setup
const logger = createLogger("logs/app.log");
logger.setLevel("info");

// Create express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/analytics", analyticsRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Sales Tracker Backend API is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
