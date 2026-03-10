/**
 * Centralized R2 object key builders for actor submissions.
 *
 * Key convention:
 *   actor-submissions/{submissionId}/images/{filename}
 *   actor-submissions/{submissionId}/audio/{filename}
 *   actor-submissions/{submissionId}/documents/{filename}
 */

export type R2MediaFolder = "images" | "audio" | "documents";

const SUBMISSION_PREFIX = "actor-submissions";

/**
 * Build a deterministic R2 object key for submission media.
 */
export function buildSubmissionKey(
  submissionId: string,
  folder: R2MediaFolder,
  filename: string
): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${SUBMISSION_PREFIX}/${submissionId}/${folder}/${sanitized}`;
}

/**
 * Extract the folder from an R2 object key.
 * Returns null if the key doesn't match the expected pattern.
 */
export function getFolderFromKey(objectKey: string): R2MediaFolder | null {
  const match = objectKey.match(
    /^actor-submissions\/[^/]+\/(images|audio|documents)\//
  );
  return match ? (match[1] as R2MediaFolder) : null;
}

/**
 * Check if a value looks like an R2 object key (not a URL or base64).
 */
export function isR2ObjectKey(value: string): boolean {
  return value.startsWith(`${SUBMISSION_PREFIX}/`) && !value.startsWith("http") && !value.startsWith("data:");
}
