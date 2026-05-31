import { Worker } from 'bullmq';
import { connection } from '../lib/redis';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

export const mergeWorker = new Worker('merge-chunks', async (job) => {
  const { sessionId } = job.data;
  console.log(`[MergeWorker] Starting merge for session: ${sessionId}`);

  try {
    // 1. Update session status
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: 'PROCESSING' }
    });

    // Mock processing delay
    await new Promise(res => setTimeout(res, 2000));

    // In a real app we would use fluent-ffmpeg here:
    // const chunks = await prisma.mediaChunk.findMany({ where: { sessionId }, orderBy: { chunkIndex: 'asc' } });
    // ffmpeg().input('concat:' + chunkFiles.join('|')).save(mergedFilePath);

    console.log(`[MergeWorker] Merge completed for session: ${sessionId}`);

    // Queue transcription
    // import { transcriptionQueue } from '../lib/redis';
    // await transcriptionQueue.add('transcribe', { sessionId });

  } catch (error) {
    console.error(`[MergeWorker] Failed for session ${sessionId}`, error);
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: 'FAILED' }
    });
  }
}, { connection });

mergeWorker.on('completed', job => {
  console.log(`[MergeWorker] Job ${job.id} completed successfully`);
});

mergeWorker.on('failed', (job, err) => {
  console.error(`[MergeWorker] Job ${job?.id} failed with error ${err.message}`);
});
