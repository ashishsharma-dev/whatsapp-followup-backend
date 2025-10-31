import cron from "node-cron"
import { Lead } from "./db/mongodb.js"
import { sendWhatsAppMessage } from "./services/aisensy.js"
import { generatePersonalizedMessage } from "./services/gemini.js"
import { logger } from "./middleware/logger.js"

export const startCronJobs = () => {
  // Run every hour
  cron.schedule("0 * * * *", async () => {
    logger.info("Running scheduled follow-up job")
    await processFollowUps()
  })

  logger.info("Cron jobs started")
}

const processFollowUps = async () => {
  try {
    const now = new Date()
    const leads = await Lead.find({})

    for (const lead of leads) {
      const hoursElapsed = (now - lead.createdAt) / (1000 * 60 * 60)

      // Follow-up 1: after 24 hours
      if (hoursElapsed >= 24 && !lead.followUp1Sent) {
        await sendFollowUp(lead, 1)
      }

      // Follow-up 2: after 48 hours
      if (hoursElapsed >= 48 && !lead.followUp2Sent) {
        await sendFollowUp(lead, 2)
      }

      // Follow-up 3: after 96 hours
      if (hoursElapsed >= 96 && !lead.followUp3Sent) {
        await sendFollowUp(lead, 3)
      }
    }
  } catch (error) {
    logger.error("Error processing follow-ups:", error.message)
  }
}

const sendFollowUp = async (lead, followUpNumber) => {
  try {
    const message = await generatePersonalizedMessage(lead.name, followUpNumber)
    const result = await sendWhatsAppMessage(lead.whatsapp, lead.name, message, {
      email: lead.email,
    })

    if (result.success) {
      const updateField = `followUp${followUpNumber}Sent`
      await Lead.findByIdAndUpdate(lead._id, {
        [updateField]: true,
        messageStage: followUpNumber,
        lastMessageAt: new Date(),
      })

      logger.info(`Follow-up ${followUpNumber} sent to ${lead.name} (${lead.whatsapp})`)
    } else {
      logger.error(`Failed to send follow-up ${followUpNumber} to ${lead.name}`)
    }
  } catch (error) {
    logger.error(`Error sending follow-up ${followUpNumber} to ${lead.name}:`, error.message)
  }
}
