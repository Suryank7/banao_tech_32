# AI Video Interview System

This documentation outlines the technical architecture, design decisions, and implementation details for the AI-driven automated video interview platform.

## 1. Problem Understanding
The primary goal is to automate the first round of candidate screening by providing an "AI" interviewer that can verbally ask questions and capture candidate responses in real-time.

**Problem:** Manual first-round interviews are time-consuming and difficult to scale.
**Need:** Recruiters need a way to screen hundreds of candidates asynchronously while maintaining a high-fidelity record of candidate responses, technical ability, and communication skills.

## 2. Architecture Overview
The system utilizes a modern React stack with a robust custom Node.js server to handle streaming, alongside an asynchronous worker layer.

### High-Level System Architecture
The architecture is divided into:
- **Frontend:** Next.js 15 (App Router) for the Candidate UI and Recruiter Dashboard.
- **WebSocket Gateway:** Custom Node.js server (`server.js`) running Socket.io for persistent connections.
- **Async Workers:** Background jobs managed via BullMQ/Redis to process heavy media files without blocking the main API.

### Media Flow
1. **Frontend:** Uses `MediaRecorder API` to capture video/audio in 3-second Blobs (chunks).
2. **Streaming:** Chunks are sent via WebSockets as binary payloads (`ArrayBuffer`) to the Node.js gateway.
3. **Storage:** Raw chunks are stored directly in Cloudflare R2 / AWS S3 with deterministic keys (e.g., `chunk_001.webm`).
4. **Processing:** Upon session completion, `merge-chunks` queue triggers a worker to run `FFmpeg` and concatenate the stream.
5. **Transcription:** The merged file is passed to Deepgram Nova-3 for fast, accurate Speech-to-Text.

### WebSocket/Event Flow Explanation
Real-time proctoring and state updates use Socket.io. When a candidate switches a tab (`visibilitychange` event) or their face disappears from the camera (`MediaPipe FaceDetection`), the frontend emits a `proctor-event` over the WebSocket. The server logs this instantly to the PostgreSQL database, flagging it on the recruiter's dashboard timeline.

## 3. Technical Decisions & Tradeoffs

- **Why streaming over full upload:** If a candidate's internet drops 14 minutes into a 15-minute interview, a full upload strategy would lose the entire video. By streaming chunks every 3 seconds, we guarantee data persistence up to the very moment of disconnect.
- **Why a Custom Node.js Server:** Next.js API routes (Serverless/Edge) are designed for request/response cycles and drop connections after a short timeout. Socket.io requires a persistent, long-lived Node.js process to maintain state and handle continuous binary chunk ingress.
- **Why BullMQ / Asynchronous processing:** Audio extraction, FFmpeg concatenation, and LLM evaluations take varying amounts of time (seconds to minutes). Doing this synchronously would block the Node.js event loop and cause timeouts.

## 4. Failure Scenarios & Edge Cases

| Scenario | Risk | Mitigation |
|---|---|---|
| **Network Interruptions** | Partial data loss | Chunk streaming ensures we only lose the last <3 seconds. |
| **WebSocket Reconnects** | Chunks arrive out of order | Chunks are assigned deterministic `chunkIndex` integers client-side. The FFmpeg worker sorts them before merging. |
| **Camera Disconnect** | Loss of video feed | `useMediaRecorder` hook pauses and prompts the user to reconnect hardware. |
| **Empty Media Chunks** | Storage bloat / FFmpeg crash | The `mergeWorker` validates blob sizes and skips corrupted chunks. |

## 5. Recovery Mechanisms

- **Chunk Recovery Strategy:** Because chunks are deterministic, if a WebSocket reconnects, it simply resumes sending from `chunkIndex + 1`. The server places them in the bucket. The merge worker ignores arrival order and sorts by index.
- **State Persistence:** The `sessionData` JSON column in the `InterviewSession` database table stores exactly which question the candidate was on. If they refresh, the interview resumes at the exact timestamp.
- **Worker Retries:** BullMQ is configured with exponential backoff. If Deepgram's API is temporarily down, the transcription job will retry automatically without losing the merged video file.

## 6. Product Thinking

- **Candidate Experience:** Added a mandatory "Hardware Check" step before the interview begins. This visually verifies microphone levels and camera feeds, significantly reducing support tickets for "blank videos".
- **Recruiter Experience:** The dashboard uses a split-pane "drill-down" view. Instead of downloading files, the recruiter sees the synchronized transcript scroll alongside the video playback.
- **Integrity Tracking:** The integration of MediaPipe for face detection happens entirely client-side (no privacy violation of sending raw frames to a 3rd party). It emits lightweight metadata flags to give recruiters confidence in the interview's integrity.

## 7. Scalability Considerations

- **Bottlenecks:** The primary bottleneck will be the `mergeWorker` running FFmpeg. Video encoding is CPU-intensive.
- **Future Improvements:** Move the FFmpeg worker to AWS Fargate or Lambda (if strictly audio) so it can scale horizontally to thousands of concurrent containers during peak hiring seasons.
- **Database Connection Pooling:** Implemented a Prisma singleton pattern to ensure the database isn't overwhelmed by excessive connections during Next.js hot-reloading or serverless scaling.

## 8. Observability & Debugging

- **Logging Strategy:** BullMQ provides `QueueEvents` which log when jobs start, fail, or stall.
- **Error Tracking:** If a chunk fails to upload, it emits a failure event via WS back to the client, which can trigger an HTTP POST fallback.
- **Debugging:** Local storage mock implementations are provided for S3 and Redis so developers can debug the entire pipeline locally without needing cloud credentials.

## 9. AI Usage Documentation

- **Thinking Accelerator:** AI was utilized to architect the BullMQ chunking strategy. I queried AI to understand the exact metadata constraints of `MediaRecorder` WebM headers vs raw blob appends.
- **Prompt Strategy:** I used sequential prompting to build out the Prisma schema first, ensuring the data layer was sound before moving to the UI layer. 
- **Decisions Made:** The decision to avoid Tailwind CSS and manually write a premium glassmorphism CSS architecture was my own design choice to ensure absolute control over the dynamic animations and gradient states.

## 10. Demo & Walkthrough

- **Setup Instructions:** 
  1. `npm install`
  2. `npx prisma generate`
  3. `npm run dev` (This starts the custom Node.js server on port 3000)
- **Demo URLs:**
  - Landing Page: `http://localhost:3000/`
  - Candidate Flow: `http://localhost:3000/demo-start`
  - Recruiter Dashboard: `http://localhost:3000/dashboard`
