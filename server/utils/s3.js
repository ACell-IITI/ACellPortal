import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import "dotenv/config";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Remove trailing slashes from the CDN URL if any
const cdnUrl = (process.env.R2_CDN_URL || "https://acellcdn.alumnicellst.workers.dev").replace(/\/$/, "");

/**
 * Uploads a local file to Cloudflare R2 and returns the public CDN URL.
 * @param {string} filePath - The local path to the file (e.g., req.file.path).
 * @param {string} folder - The destination folder in the bucket (e.g., 'newsletters').
 * @param {string} originalName - The original name of the file to determine extension/mime.
 * @returns {Promise<{ url: string, objectKey: string }>} - The public URL and the R2 object key.
 */
export const uploadToR2 = async (filePath, folder, originalName) => {
  try {
    if (!filePath || !folder) {
      throw new Error("filePath or folder missing");
    }

    const { randomUUID } = await import("crypto");
    const fileStream = fs.createReadStream(filePath);
    const ext = path.extname(originalName) || "";
    const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const objectKey = `${folder}/${fileName}`;

    // Determine mime type
    const mimeType = mime.lookup(originalName) || "application/octet-stream";

    const uploadParams = {
      Bucket: "acellmedia",
      Key: objectKey,
      Body: fileStream,
      ContentType: mimeType,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    return {
      url: `${cdnUrl}/${objectKey}`,
      objectKey: objectKey,
    };
  } catch (err) {
    console.error("R2 Upload error:", err);
    throw err;
  }
};

/**
 * Extracts the R2 object key from an object key or public URL.
 * Supports:
 * - Direct object keys: 'team/12345-photo.jpg'
 * - CDN URLs: 'https://acellcdn.alumnicellst.workers.dev/team/12345-photo.jpg'
 * - Direct R2 bucket URLs: 'https://...r2.cloudflarestorage.com/acellmedia/team/12345-photo.jpg'
 * Returns null if the URL is not hosted on R2, is a local relative asset, or is empty.
 *
 * @param {string} keyOrUrl - The object key or URL
 * @returns {string|null}
 */
export const extractR2Key = (keyOrUrl) => {
  if (!keyOrUrl || typeof keyOrUrl !== "string") return null;
  const trimmed = keyOrUrl.trim();
  if (!trimmed) return null;

  const bucketName = process.env.R2_BUCKET || "acellmedia";

  // If local relative frontend path (e.g., /Team/... or ../Team/...), it's not in R2
  if (trimmed.startsWith(".") || trimmed.startsWith("/")) {
    return null;
  }

  // If it does not start with http:// or https://, treat as direct key if valid
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    // Check if hostname belongs to CDN or R2 endpoint
    let cdnHostname = "";
    try {
      if (process.env.R2_CDN_URL) {
        cdnHostname = new URL(process.env.R2_CDN_URL).hostname.toLowerCase();
      }
    } catch (e) {}

    const isR2Host =
      (cdnHostname && host === cdnHostname) ||
      host === "acellcdn.alumnicellst.workers.dev" ||
      host.endsWith("r2.cloudflarestorage.com") ||
      host.endsWith("r2.dev") ||
      host.endsWith("workers.dev");

    let pathname = decodeURIComponent(parsed.pathname).replace(/^\/+/, "");

    // If bucket name is prefixed in the pathname
    if (pathname.startsWith(`${bucketName}/`)) {
      pathname = pathname.substring(bucketName.length + 1);
    }

    if (
      isR2Host ||
      pathname.startsWith("team/") ||
      pathname.startsWith("newsletters/") ||
      pathname.startsWith("magazines/") ||
      pathname.startsWith("yearbooks/") ||
      pathname.startsWith("alumni-contributions/")
    ) {
      return pathname;
    }

    return null;
  } catch (err) {
    return null;
  }
};

/**
 * Deletes a file from Cloudflare R2.
 * Accepts either an R2 object key (e.g., 'newsletters/123-file.pdf') or a public CDN/R2 URL.
 * @param {string} objectKeyOrUrl - The R2 object key or public URL.
 */
export const deleteFromR2 = async (objectKeyOrUrl) => {
  try {
    if (!objectKeyOrUrl) {
      return;
    }

    const objectKey = extractR2Key(objectKeyOrUrl);
    if (!objectKey) {
      return;
    }

    const bucketName = process.env.R2_BUCKET || "acellmedia";
    const deleteParams = {
      Bucket: bucketName,
      Key: objectKey,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
    console.log(`[R2 Delete] Successfully deleted object: ${objectKey}`);
  } catch (err) {
    console.error(`[R2 Delete] Error deleting ${objectKeyOrUrl}:`, err);
    throw err;
  }
};

/**
 * Extracts the Google Drive file ID from various Drive URL formats.
 * Supports: /file/d/<id>/, ?id=<id>, /d/<id>/
 */
export const extractDriveFileId = (url) => {
  if (!url) return null;
  // If multiple URLs separated by commas, whitespace or newlines, take the first one
  const firstUrl = String(url).split(/[\s,;\n\r]+/)[0].trim();
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)(?:[\/?&#]|$)/,
    /[?&]id=([a-zA-Z0-9_-]+)(?:[&?]|$)/,
    /\/d\/([a-zA-Z0-9_-]+)(?:[\/?&#]|$)/,
  ];
  for (const pattern of patterns) {
    const match = firstUrl.match(pattern);
    if (match) return match[1];
  }
  return null;
};

/**
 * Uploads a raw Buffer to Cloudflare R2 and returns the public CDN URL.
 * @param {Buffer} buffer - The image buffer.
 * @param {string} folder - Destination folder in the bucket (e.g., 'team').
 * @param {string} ext - File extension without dot (e.g., 'jpg').
 * @returns {Promise<{ url: string, objectKey: string }>}
 */
export const uploadBufferToR2 = async (buffer, folder, ext = "jpg") => {
  const { randomUUID } = await import("crypto");
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  const objectKey = `${folder}/${fileName}`;
  const mimeType = mime.lookup(`.${ext}`) || "image/jpeg";

  const uploadParams = {
    Bucket: "acellmedia",
    Key: objectKey,
    Body: buffer,
    ContentType: mimeType,
  };

  await s3Client.send(new PutObjectCommand(uploadParams));

  return {
    url: `${cdnUrl}/${objectKey}`,
    objectKey,
  };
};

/**
 * Given a raw image URL (which may be a Google Drive sharing link),
 * downloads the image and uploads it to R2, returning the CDN URL.
 * If the URL is already a CDN/direct URL, returns it as-is.
 * Falls back to a lh3.googleusercontent.com direct link if upload fails.
 *
 * @param {string} rawUrl - The raw URL from the Excel sheet.
 * @param {string} folder - R2 folder to upload into (default: 'team').
 * @returns {Promise<string>} - The final image URL to store in DB.
 */
export const processAndUploadImageUrl = async (rawUrl, folder = "team") => {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  const trimmed = rawUrl.trim();

  // Already a CDN or local path — no processing needed
  if (
    trimmed.startsWith(cdnUrl) ||
    trimmed.startsWith("../Team/") ||
    trimmed.startsWith("/Team/")
  ) {
    return trimmed;
  }

  const fileId = extractDriveFileId(trimmed);
  if (!fileId) {
    // Not a Drive link — return as-is (could be any public image URL)
    return trimmed;
  }

  // Try multiple Drive download URL strategies
  const downloadUrls = [
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://drive.usercontent.google.com/download?id=${fileId}&export=view`,
    `https://drive.google.com/uc?export=download&id=${fileId}`,
  ];

  for (const downloadUrl of downloadUrls) {
    try {
      const response = await fetch(downloadUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
        redirect: "follow",
      });

      if (!response.ok) continue;

      const contentType = response.headers.get("content-type") || "";

      // Skip if we got an HTML page (Drive confirmation page)
      if (contentType.includes("text/html")) continue;

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Skip suspiciously small responses (likely error pages)
      if (buffer.length < 500) continue;

      const ext = mime.extension(contentType) || "jpg";
      const { url } = await uploadBufferToR2(buffer, folder, ext);
      console.log(`[Drive→R2] Uploaded ${fileId} → ${url}`);
      return url;
    } catch (err) {
      console.warn(`[Drive→R2] Failed attempt for ${downloadUrl}:`, err.message);
    }
  }

  // All uploads failed — fall back to lh3 direct link (may still work in browser)
  const fallback = `https://lh3.googleusercontent.com/d/${fileId}`;
  console.warn(`[Drive→R2] All upload attempts failed for ${fileId}, using fallback: ${fallback}`);
  return fallback;
};
