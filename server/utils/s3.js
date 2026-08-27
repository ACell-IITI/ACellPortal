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
const cdnUrl = process.env.R2_CDN_URL?.replace(/\/$/, "");

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

    const fileStream = fs.createReadStream(filePath);
    const fileName = `${Date.now()}-${path.basename(originalName).replace(/\s+/g, "_")}`;
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
 * Deletes a file from Cloudflare R2.
 * @param {string} objectKey - The R2 object key (e.g., 'newsletters/123-file.pdf').
 */
export const deleteFromR2 = async (objectKey) => {
  try {
    if (!objectKey) {
      return;
    }

    const deleteParams = {
      Bucket: "acellmedia",
      Key: objectKey,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (err) {
    console.error("R2 Delete error:", err);
    throw err;
  }
};
