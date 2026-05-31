import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const chunksDir = path.join(process.cwd(), ".local-storage", sessionId, "chunks");

  if (!fs.existsSync(chunksDir)) {
    return new NextResponse("No video found", { status: 404 });
  }

  // Read all chunk files and concatenate them
  const files = fs
    .readdirSync(chunksDir)
    .filter((f) => f.endsWith(".webm"))
    .sort();

  if (files.length === 0) {
    return new NextResponse("No video chunks found", { status: 404 });
  }

  // Concatenate all chunks into a single buffer
  const buffers = files.map((f) => fs.readFileSync(path.join(chunksDir, f)));
  const combined = Buffer.concat(buffers);

  return new NextResponse(combined, {
    status: 200,
    headers: {
      "Content-Type": "video/webm",
      "Content-Length": String(combined.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
