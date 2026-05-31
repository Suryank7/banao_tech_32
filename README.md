<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Video%20Camera.png" alt="Video Camera" width="100" />

  <h1 align="center">AI Video Interviewer Platform</h1>
  
  <p align="center">
    <strong>Next-gen automated screening platform built for scale, resilience, and real-time intelligence.</strong>
  </p>

  <p align="center">
    <a href="#features"><img src="https://img.shields.io/badge/Features-✨-blue?style=for-the-badge&color=000000" alt="Features"></a>
    <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-🏗️-blue?style=for-the-badge&color=000000" alt="Architecture"></a>
    <a href="#proctoring"><img src="https://img.shields.io/badge/Proctoring-🛡️-blue?style=for-the-badge&color=000000" alt="Proctoring"></a>
  </p>
</div>

<br />

> **Scale your first-round screening asynchronously.** Our AI asks the right questions, analyzes responses in real-time, and provides unbiased hiring signals.

<div align="center">
  <!-- Placeholder for a high-quality GIF of the UI -->
  <img src="https://cdn.dribbble.com/users/1208688/screenshots/16382022/media/4e02debc078b5ce5387eec8d9bb0d5db.gif" alt="Platform Demo" style="border-radius: 12px; box-shadow: 0 0 20px rgba(255,255,255,0.1); max-width: 100%;" />
</div>

<hr />

## ✨ Core Features

* **🎥 Streaming Video Ingress:** 3-second `Blob` chunking over WebSockets ensures network drops don't lose the entire interview.
* **🧠 Real-Time AI Evaluation:** Syncs transcripts and provides automated scoring on technical ability and communication.
* **🛡️ Integrity & Proctoring:** Tab-switching (`visibilitychange`) and Face Absence tracking sent via low-latency sockets.
* **🎨 Premium Aesthetics:** Custom dark-mode, glassmorphism design system built without heavy CSS frameworks.
* **🔄 Asynchronous Processing:** BullMQ & Redis queues offload FFmpeg video concatenation to background workers.

## 🏗️ System Architecture

Our platform utilizes a robust hybrid approach to solve the problem of persistent streaming in a serverless ecosystem.

<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png" alt="Rocket" width="50" />
</div>

### The Tech Stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Gateway:** Custom Node.js Server (`server.js`) running `Socket.io`
- **Database:** PostgreSQL accessed via Prisma v7
- **Workers:** BullMQ + Redis for background media processing

*(Read the deep-dive technical architecture, failure recovery, and trade-offs in [docs/README.md](./docs/README.md))*

## 🚀 Quick Start

Ensure you have Node.js 18+ and PostgreSQL installed.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ai-interviewer.git
cd ai-interviewer

# 2. Install Dependencies
npm install

# 3. Setup Database (Prisma)
# Ensure your .env has a valid DATABASE_URL
npx prisma db push
npx prisma generate

# 4. Start the Application
npm run dev
```

> **Note:** `npm run dev` kicks off the custom `node server.js` script, spinning up both Next.js and the WebSocket gateway on `http://localhost:3000`.

## 🎮 Walkthrough

### 1. Candidate Hardware Validation
Before the session starts, candidates go through a rigorous microphone and camera check.
> Try it: navigate to `http://localhost:3000/demo-start`

### 2. Recruiter Dashboard (Drill-down)
Recruiters get a synchronized split-pane view. They can watch the concatenated video, read the synchronized transcript, and view the AI's final hire recommendation.
> Try it: navigate to `http://localhost:3000/dashboard`

---
<div align="center">
  <p>Built with ❤️ and a relentless focus on UI/UX excellence.</p>
</div>
