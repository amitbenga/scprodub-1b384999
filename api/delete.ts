import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint =
    process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 environment variables are not configured. Required: R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and either R2_ENDPOINT or R2_ACCOUNT_ID"
    );
  }

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function getR2BucketName(): string {
  const bucketName = process.env.R2_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME is not configured");
  }
  return bucketName;
}

/**
 * Vercel serverless function to delete an R2 object.
 * Used for cleanup when a DB insert fails after files were already uploaded.
 *
 * Expects: POST with JSON body { objectKey: string }
 * Returns: { deleted: true }
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const { objectKey } = req.body as { objectKey?: string };

    if (!objectKey || typeof objectKey !== "string") {
      return res.status(400).json({ error: "Missing objectKey" });
    }

    // Only allow deletion within the actor-submissions prefix
    if (!objectKey.startsWith("actor-submissions/")) {
      return res.status(403).json({ error: "Deletion only allowed under actor-submissions/" });
    }

    // Validate key format
    if (!/^actor-submissions\/[a-zA-Z0-9-]+\/(images|audio|documents)\/[a-zA-Z0-9._-]+$/.test(objectKey)) {
      return res.status(400).json({ error: "Invalid object key format" });
    }

    const bucketName = getR2BucketName();
    const r2 = getR2Client();

    await r2.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      })
    );

    console.log(`[R2 Delete] Cleaned up: ${objectKey}`);
    return res.status(200).json({ deleted: true });
  } catch (err) {
    console.error("[R2 Delete] Error:", err);
    const message = err instanceof Error ? err.message : "Delete failed";
    return res.status(500).json({ error: message });
  }
}
