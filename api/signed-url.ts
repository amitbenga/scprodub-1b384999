import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
 * Server-side signed URL generator for private R2 objects.
 *
 * The R2 bucket is PRIVATE — objects are never publicly accessible.
 * All read access goes through this endpoint, which generates a
 * time-limited, pre-signed S3-compatible URL.
 *
 * POST /api/signed-url
 * Body: { objectKey: string }
 * Returns: { signedUrl: string, expiresAt: string (ISO) }
 *
 * Access control:
 *   - Object key must be under the actor-submissions/ prefix
 *   - Key format is validated against the known pattern
 *   - Signed URL expires after SIGNED_URL_TTL_SECONDS (default: 900 = 15 min)
 *   - R2 credentials are server-side only; never exposed to the client
 *
 * To add authentication (e.g. Supabase JWT verification) before serving
 * signed URLs, verify the Authorization header here using the Supabase
 * service-role key (SUPABASE_SERVICE_ROLE_KEY) before issuing the URL.
 */

const SIGNED_URL_TTL_SECONDS = 900; // 15 minutes

// Strict key pattern: actor-submissions/{uuid}/{folder}/{filename}
const VALID_KEY_RE =
  /^actor-submissions\/[a-zA-Z0-9-]{36}\/(images|audio|documents)\/[a-zA-Z0-9._-]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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

    // Validate key is within the actor-submissions prefix
    if (!objectKey.startsWith("actor-submissions/")) {
      return res.status(403).json({ error: "Access denied: key not under actor-submissions/" });
    }

    // Validate exact key format to prevent traversal or probing
    if (!VALID_KEY_RE.test(objectKey)) {
      return res.status(400).json({ error: "Invalid object key format" });
    }

    const bucketName = getR2BucketName();
    const r2 = getR2Client();

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const signedUrl = await getSignedUrl(r2, command, {
      expiresIn: SIGNED_URL_TTL_SECONDS,
    });

    const expiresAt = new Date(Date.now() + SIGNED_URL_TTL_SECONDS * 1000).toISOString();

    console.log(`[R2 Signed URL] Issued for: ${objectKey} (expires ${expiresAt})`);

    return res.status(200).json({ signedUrl, expiresAt });
  } catch (err) {
    console.error("[R2 Signed URL] Error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate signed URL";
    return res.status(500).json({ error: message });
  }
}
