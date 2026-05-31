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
    // If no real chunks exist (e.g., mock candidate data), return a sample stock video URL
    return NextResponse.redirect("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
  }

  // Read all chunk files and concatenate them
  const files = fs
    .readdirSync(chunksDir)
    .filter((f) => f.endsWith(".webm"))
    .sort();

  if (files.length === 0) {
    // Return sample stock video if directory exists but is empty
    return NextResponse.redirect("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
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
