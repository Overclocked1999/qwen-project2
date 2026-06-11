# Qwen Chat App

A real-time AI chat application powered by Qwen 3.5 (397B MoE) via the NVIDIA Inference API. Built with Next.js and designed to provide streaming, ChatGPT-like interactions.

---

## Features

- Real-time streaming AI responses
- Chat-style user interface
- Server-side API route proxy (`/api/chat`)
- Server-Sent Events (SSE) parsing for token streaming
- Large-scale reasoning model support (Qwen 3.5 397B MoE)
- Responsive frontend interface
- Lightweight client-server architecture

---

## Tech Stack

- Next.js (App Router)
- React (Client Components)
- NVIDIA Inference API
- Qwen 3.5 397B MoE
- Server-Sent Events (streaming)

---

## Architecture

1. User sends a message from the frontend
2. Request is sent to `/api/chat`
3. Server forwards request to NVIDIA Inference API
4. Response is streamed back as SSE chunks
5. Frontend parses stream and updates UI in real time

---

## Project Structure

app/
  api/
    chat/
      route.js        API proxy to Qwen
  page.tsx            Chat interface

lib/
  qwen.js             Optional API helper

---

## Environment Variables

Create a `.env.local` file in the project root:

QWEN_API_URL=https://integrate.api.nvidia.com/v1/chat/completions
QWEN_API_KEY=your_api_key_here

---

## Running Locally

Install dependencies:

npm install

Start development server:

npm run dev

Open:

http://localhost:3000

---

## Deployment

### Netlify

1. Push the project to a GitHub repository
2. Import the repository into Netlify
3. Add environment variables in Netlify project settings
4. Deploy

After deployment, the application will be available at a Netlify subdomain.

---

## Notes

- The model used is large and may have variable latency depending on API load.
- Streaming is handled via SSE parsing in the frontend.
- API keys must remain server-side and must not be exposed to the client.

---

## Future Improvements

- Multi-chat support
- User authentication system
- Model routing (fast vs reasoning models)
- Markdown and code highlighting support
- Rate limiting and usage tracking
