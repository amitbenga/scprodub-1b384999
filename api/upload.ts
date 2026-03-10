import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2BucketName } from "./_r2";

const ALLOWED_FOLDERS = ["images", "audio", "documents"] as const;
type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES: Record<AllowedFolder, string[]> = {
  images: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  audio: [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/x-m4a",
    "audio/m4a",
    "audio/ogg",
    "audio/aac",
    "audio/webm",
  ],
  documents: ["application/pdf"],
};

function isAllowedFolder(folder: string): folder is AllowedFolder {
  return ALLOWED_FOLDERS.includes(folder as AllowedFolder);
}

/**
 * Vercel serverless function for uploading files to Cloudflare R2.
 *
 * Expects:
 * - Raw file body (Content-Type set to the file's MIME type)
 * - Query params: folder, submissionId, filename
 *
 * Returns: { objectKey: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for the SPA
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const folder = req.query.folder as string;
    const submissionId = req.query.submissionId as string;
    const filename = req.query.filename as string;
    const contentType = req.headers["content-type"] || "application/octet-stream";

    // Validate required params
    if (!folder || !submissionId || !filename) {
      return res.status(400).json({ error: "Missing required query params: folder, submissionId, filename" });
    }

    // Validate folder
    if (!isAllowedFolder(folder)) {
      return res.status(400).json({ error: `Invalid folder: ${folder}. Allowed: ${ALLOWED_FOLDERS.join(", ")}` });
    }

    // Validate MIME type
    const allowedTypes = ALLOWED_MIME_TYPES[folder];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ error: `File type not allowed for ${folder}: ${contentType}` });
    }

    // Validate submissionId format (UUID-like alphanumeric with hyphens)
    if (!/^[a-zA-Z0-9-]+$/.test(submissionId)) {
      return res.status(400).json({ error: "Invalid submissionId format" });
    }

    // Read the raw body
    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      req.on("end", resolve);
      req.on("error", reject);
    });
    const fileBuffer = Buffer.concat(chunks);

    // Validate file size
    if (fileBuffer.length === 0) {
      return res.status(400).json({ error: "Empty file body" });
    }
    if (fileBuffer.length > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "File too large (max 10MB)" });
    }

    // Sanitize filename (keep extension, replace unsafe chars)
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Build deterministic R2 object key:
    // actor-submissions/{submissionId}/{folder}/{filename}
    const objectKey = `actor-submissions/${submissionId}/${folder}/${sanitizedFilename}`;

    const bucketName = getR2BucketName();
    const r2 = getR2Client();

    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: contentType,
      })
    );

    console.log(`[R2 Upload] OK: ${objectKey} (${fileBuffer.length} bytes, ${contentType})`);

    return res.status(200).json({ objectKey });
  } catch (err) {
    console.error("[R2 Upload] Error:", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return res.status(500).json({ error: message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
