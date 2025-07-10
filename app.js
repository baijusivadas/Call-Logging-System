import express from "express";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import callRoutes from "./routes/callRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { fileURLToPath } from "url";
// import { createLogger } from "logger";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
// Logger setup
// const logger = createLogger("logs/app.log");
// logger.setLevel("info");

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

//error handling middleware
app.use((err, req, res, next) => {
  // logger.error(`Error occurred: ${err.message}`);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
