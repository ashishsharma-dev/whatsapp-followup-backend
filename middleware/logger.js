export const logger = {
  info: (message, data = "") => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] INFO: ${message}`, data)
  },
  error: (message, data = "") => {
    const timestamp = new Date().toISOString()
    console.error(`[${timestamp}] ERROR: ${message}`, data)
  },
  warn: (message, data = "") => {
    const timestamp = new Date().toISOString()
    console.warn(`[${timestamp}] WARN: ${message}`, data)
  },
}

export const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled error:", err.message)
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "An error occurred",
  })
}
