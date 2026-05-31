const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");

// To keep things simple and avoid transpilation issues with server.js in TS Next.js, 
// we'll run a basic server.js and handle chunks carefully.

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    maxHttpBufferSize: 1e8, // 100MB max payload for chunks
  });

  io.on("connection", (socket) => {
    console.log("Client connected via WebSocket:", socket.id);

    // Join a specific interview session room
    socket.on("join-session", ({ sessionId }) => {
      socket.join(sessionId);
      console.log(`Socket ${socket.id} joined session ${sessionId}`);
    });

    // Handle media chunk reception
    socket.on("media-chunk", async (data) => {
      const { sessionId, chunkIndex, buffer, questionIndex } = data;
      // In a real app, we'd save it to S3 directly here, but since this is commonjs, 
      // and we have ts modules, we might just use fetch to hit our own Next.js API route 
      // or we can write a simple fs write here for fallback mock.
      try {
        const fs = require('fs');
        const path = require('path');
        const dir = path.join(process.cwd(), '.local-storage', sessionId, 'chunks');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const key = `chunk_${String(chunkIndex).padStart(4, '0')}.webm`;
        fs.writeFileSync(path.join(dir, key), buffer);
        
        // Acknowledge receipt
        socket.emit("chunk-received", { chunkIndex, success: true });
      } catch (err) {
        console.error("Failed to save chunk", err);
        socket.emit("chunk-received", { chunkIndex, success: false });
      }
    });

    socket.on("proctor-event", (data) => {
      console.log("Proctor Event:", data);
      // We would save this to the DB.
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
