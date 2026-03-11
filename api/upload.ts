import type { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_FOLDERS = ["images", "audio", "documents"] as const;
type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

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
 * Vercel serverless function for generating a Cloudflare R2 Presigned Upload URL.
 *
 * Expects POST JSON body:
 * { folder, submissionId, filename, contentType }
 *
 * Returns: { uploadUrl: string, objectKey: string }
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
    const { folder, submissionId, filename, contentType } = req.body || {};

    // Validate required params
    if (!folder || !submissionId || !filename || !contentType) {
      return res.status(400).json({ error: "Missing required JSON body params: folder, submissionId, filename, contentType" });
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

    // Sanitize filename (keep extension, replace unsafe chars)
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Build deterministic R2 object key:
    // actor-submissions/{submissionId}/{folder}/{filename}
    const objectKey = `actor-submissions/${submissionId}/${folder}/${sanitizedFilename}`;

    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const endpoint =
      process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      return res.status(500).json({
        error: "R2 environment variables are not configured. Required: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and either R2_ENDPOINT or R2_ACCOUNT_ID",
      });
    }

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      return res.status(500).json({ error: "R2_BUCKET_NAME is not configured" });
    }

    const r2 = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType,
    });

    // Generate a temporary PUT URL that expires in 15 minutes
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 900 });

    console.log(`[R2 Upload URL Issued] OK: ${objectKey} (${contentType})`);

    return res.status(200).json({ uploadUrl, objectKey });
  } catch (err) {
    console.error("[R2 Upload URL] Error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate signed upload URL";
    return res.status(500).json({ error: message });
  }
}
