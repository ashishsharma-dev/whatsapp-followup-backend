import { Lead } from "../db/mongodb.js"
import { sendWelcomeMessage } from "../services/aisensy.js"
import { logger } from "../middleware/logger.js"

export const registerLead = async (req, res) => {
  try {
    const { name, email, whatsapp } = req.body

    // Validation
    if (!name || !email || !whatsapp) {
      return res.status(400).json({
        error: "Missing required fields: name, email, whatsapp",
      })
    }

    // Check if lead already exists
    const existingLead = await Lead.findOne({ email })
    if (existingLead) {
      return res.status(409).json({ error: "Lead with this email already exists" })
    }

    // Create new lead
    const lead = new Lead({
      name,
      email,
      whatsapp,
      messageStage: 0,
    })

    await lead.save()
    logger.info(`New lead registered: ${name} (${email})`)

    // Send welcome message
    const welcomeResult = await sendWelcomeMessage(lead)

    res.status(201).json({
      success: true,
      message: "Lead registered successfully",
      leadId: lead._id,
      welcomeMessageSent: welcomeResult.success,
    })
  } catch (error) {
    logger.error("Error registering lead:", error.message)
    res.status(500).json({
      error: "Failed to register lead",
      message: error.message,
    })
  }
}
