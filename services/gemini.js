import { GoogleGenerativeAI } from "@google/generative-ai"
import { logger } from "../middleware/logger.js"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const generatePersonalizedMessage = async (userName, followUpNumber) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompts = {
      1: `Write a short, friendly WhatsApp follow-up message for a customer named "${userName}" after 24 hours. Keep it to 1-2 sentences. Make it casual and engaging. No emojis.`,
      2: `Write a short, friendly WhatsApp follow-up message for a customer named "${userName}" after 48 hours. Mention that we want to help them. Keep it to 1-2 sentences. No emojis.`,
      3: `Write a short, friendly WhatsApp follow-up message for a customer named "${userName}" after 96 hours. This is the final follow-up, so make it compelling and mention a special offer or discount. Keep it to 2-3 sentences. No emojis.`,
    }

    const prompt = prompts[followUpNumber] || prompts[1]
    const result = await model.generateContent(prompt)
    const message = result.response.text().trim()

    logger.info(`Generated personalized message for ${userName} (Follow-up ${followUpNumber})`)
    return message
  } catch (error) {
    logger.error(`Failed to generate message for ${userName}:`, error.message)
    // Return a default message if API fails
    return getDefaultMessage(userName, followUpNumber)
  }
}

const getDefaultMessage = (userName, followUpNumber) => {
  const defaults = {
    1: `Hi ${userName}! Just checking in to see if you have any questions. We're here to help!`,
    2: `${userName}, we'd love to assist you with your needs. Reply with any questions!`,
    3: `${userName}, this is our final follow-up. Don't miss out on our special offer for you!`,
  }
  return defaults[followUpNumber] || defaults[1]
}
