import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { registerLead } from "./routes/leads.js"
import { startCronJobs } from "./cron.js"
import { errorHandler, logger } from "./middleware/logger.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => logger.info("MongoDB connected successfully"))
  .catch((err) => {
    logger.error("MongoDB connection failed:", err.message)
    process.exit(1)
  })

// Routes
app.post("/api/leads/register", registerLead)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  // Start cron jobs
  startCronJobs()
})

export default app
