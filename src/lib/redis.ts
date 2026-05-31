import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const isMock = !process.env.REDIS_URL;

// We use ioredis directly. If REDIS_URL is absent and we don't have a local redis,
// we will handle workers in-process directly for dev, but let's assume we have redis or handle errors.

export const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    if (isMock && times > 3) {
      console.warn('Redis connection failed (Mock Mode). Make sure Redis is running if you need queues.');
      return null;
    }
    return Math.min(times * 50, 2000);
  }
});

// Queue instances
export const mergeQueue = new Queue('merge-chunks', { connection });
export const transcriptionQueue = new Queue('transcription', { connection });
export const evaluationQueue = new Queue('evaluation', { connection });

// Helper to enqueue a merge job
export async function enqueueMerge(sessionId: string) {
  if (isMock && connection.status !== 'ready') {
    console.log(`[Mock] Enqueue merge for session ${sessionId}`);
    return;
  }
  await mergeQueue.add('merge', { sessionId }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  });
}
