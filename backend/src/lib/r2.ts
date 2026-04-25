/**
 * Cloudflare R2 Storage Client
 * S3-compatible object storage for plant photos, streak logs, etc.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env["R2_ACCOUNT_ID"] ?? "";
const R2_ACCESS_KEY_ID = process.env["R2_ACCESS_KEY_ID"] ?? "";
const R2_SECRET_ACCESS_KEY = process.env["R2_SECRET_ACCESS_KEY"] ?? "";
const R2_BUCKET_NAME = process.env["R2_BUCKET_NAME"] ?? "grooted-photos";
const R2_ENDPOINT =
  process.env["R2_ENDPOINT"] ??
  `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file to R2
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  // Return the public URL (configure custom domain or R2 public access)
  return `${R2_ENDPOINT}/${R2_BUCKET_NAME}/${key}`;
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    }),
  );
}

/**
 * Generate a unique key for plant photos
 */
export function generatePhotoKey(
  userId: string,
  type: "streak" | "plant" | "scan",
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${type}/${userId}/${timestamp}-${random}.jpg`;
}
