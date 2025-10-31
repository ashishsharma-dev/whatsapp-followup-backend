import axios from "axios"
import { logger } from "../middleware/logger.js"

const AISENSY_API_URL = "https://backend.aisensy.com/campaign/t1/api/v2"

export const sendWhatsAppMessage = async (destination, userName, messageText, attributes = {}) => {
  try {
    const payload = {
      apiKey: process.env.AISENSY_API_KEY,
      campaignName: "after-dark-followup",
      destination,
      userName,
      message: messageText,
      attributes: { email: attributes.email || "", ...attributes },
      source: "render-cron",
    }

    logger.info(`Sending WhatsApp message to ${destination}`)

    const response = await axios.post(AISENSY_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    })

    logger.info(`WhatsApp message sent successfully to ${destination}`, response.data)
    return { success: true, data: response.data }
  } catch (error) {
    logger.error(`Failed to send WhatsApp message to ${destination}:`, error.message)
    return { success: false, error: error.message }
  }
}

export const sendWelcomeMessage = async (lead) => {
  const welcomeText = `Hi ${lead.name}! Welcome to After Dark. We're excited to have you on board! 🎉`
  return sendWhatsAppMessage(lead.whatsapp, lead.name, welcomeText, { email: lead.email })
}
