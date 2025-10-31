# WhatsApp Follow-up Automation Backend

A production-ready Node.js Express backend that automates WhatsApp follow-ups using AI Sensy and Google Gemini APIs.

## Features

- **Lead Registration**: POST endpoint to register leads from Shopify password page
- **Welcome Messages**: Instant WhatsApp message on registration via AI Sensy
- **Automated Follow-ups**: Cron job runs hourly to send personalized follow-ups at 24h, 48h, and 96h
- **AI Personalization**: Uses Google Gemini to generate personalized messages for each lead
- **Error Handling**: Comprehensive logging and error management
- **Production Ready**: Optimized for deployment on Render

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- MongoDB database (Atlas or local)
- AI Sensy API key
- Google Gemini API key

### 2. Installation

\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

\`\`\`bash
cp .env.example .env
\`\`\`

Required variables:
- `MONGODB_URI`: Your MongoDB connection string
- `AISENSY_API_KEY`: Your AI Sensy API key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `PORT`: Server port (default 3000)

### 4. Local Development

\`\`\`bash
npm run dev
\`\`\`

### 5. Deployment on Render

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables in Render dashboard
5. Deploy with `npm start` as the start command

## API Endpoints

### POST /register
Register a new lead and send welcome message.

**Request:**
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "whatsapp": "+1234567890"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Lead registered successfully",
  "leadId": "507f1f77bcf86cd799439011",
  "welcomeMessageSent": true
}
\`\`\`

### GET /health
Health check endpoint.

**Response:**
\`\`\`json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\`\`\`

## How It Works

1. **Registration**: Lead data is received at `/register` and saved to MongoDB
2. **Welcome Message**: AI Sensy sends an instant WhatsApp welcome message
3. **Cron Job**: Runs every hour to check for leads that need follow-ups
4. **Follow-up Messages**: Sends personalized messages at 24h, 48h, and 96h using Gemini API
5. **Tracking**: Each lead tracks which follow-ups have been sent to avoid duplicates

## Database Schema

**Lead Collection:**
\`\`\`
{
  name: String,
  email: String,
  whatsapp: String,
  messageStage: Number (0-3),
  followUp1Sent: Boolean,
  followUp2Sent: Boolean,
  followUp3Sent: Boolean,
  lastMessageAt: Date,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Error Handling

- Failed WhatsApp sends are logged but don't crash the server
- Gemini API fallback uses default messages if generation fails
- All errors are timestamped and logged to console
- Database errors prevent server startup with clear error messages

## Production Considerations

- Set `NODE_ENV=production` in Render
- Use strong MongoDB credentials
- Rotate API keys regularly
- Monitor logs in Render dashboard
- Set up alerts for failed message sends
- Consider rate limiting for the `/register` endpoint
