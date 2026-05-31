import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';

const isMock = !process.env.AWS_ACCESS_KEY_ID;

let s3Client: S3Client | null = null;

if (!isMock) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

const bucketName = process.env.AWS_S3_BUCKET_NAME || 'banao-video-interviews';

// Local mock storage directory
const LOCAL_STORAGE_DIR = path.join(process.cwd(), '.local-storage');
if (isMock && !fs.existsSync(LOCAL_STORAGE_DIR)) {
  fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
}

export async function putChunk(sessionId: string, chunkIndex: number, buffer: Buffer): Promise<string> {
  const key = `sessions/${sessionId}/chunks/chunk_${chunkIndex.toString().padStart(4, '0')}.webm`;

  if (isMock) {
    const sessionDir = path.join(LOCAL_STORAGE_DIR, sessionId, 'chunks');
    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });
    
    const filePath = path.join(LOCAL_STORAGE_DIR, key);
    // Ensure dir exists for the key path
    if (!fs.existsSync(path.dirname(filePath))) fs.mkdirSync(path.dirname(filePath), { recursive: true });
    
    fs.writeFileSync(filePath, buffer);
    return key;
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: 'video/webm',
  });

  await s3Client!.send(command);
  return key;
}

export async function getMergedUrl(sessionId: string): Promise<string> {
  const key = `sessions/${sessionId}/merged.webm`;

  if (isMock) {
    return `/api/local-media/${sessionId}/merged.webm`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client!, command, { expiresIn: 3600 });
}

export async function getLocalFilePath(key: string): Promise<string> {
  return path.join(LOCAL_STORAGE_DIR, key);
}
