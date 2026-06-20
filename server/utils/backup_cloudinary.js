import fs from "fs";
import path from "path";

// ─────────────────────────────────────────────
//  CONFIGURATION
// ─────────────────────────────────────────────

const ROOT_BACKUP_DIR = "D:\\CODES\\Acell\\website_backup";

// Create the root backup folder if it doesn't already exist
if (!fs.existsSync(ROOT_BACKUP_DIR)) {
    fs.mkdirSync(ROOT_BACKUP_DIR, { recursive: true });
}

// Track already-downloaded files to avoid duplicates within a session
const downloaded = new Set();


// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

/**
 * Downloads a single file from a URL and saves it inside a
 * collection-specific subfolder of ROOT_BACKUP_DIR.
 *
 * @param {string} url            - The remote URL to download.
 * @param {string} collectionName - Name of the Mongoose collection (used as subfolder).
 */
async function downloadFile(url, collectionName) {
    const collectionDir = path.join(ROOT_BACKUP_DIR, collectionName);

    // Create the collection subfolder if it doesn't exist
    if (!fs.existsSync(collectionDir)) {
        fs.mkdirSync(collectionDir, { recursive: true });
    }

    // Extract the filename from the URL (e.g. "photo_abc123.jpg")
    const filename = path.basename(new URL(url).pathname);

    // Use "collectionName_filename" as a unique key to skip re-downloads
    const uniqueKey = `${collectionName}_${filename}`;

    if (downloaded.has(uniqueKey)) {
        return; // Already downloaded in this session — skip
    }

    downloaded.add(uniqueKey);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const destPath = path.join(collectionDir, filename);

        fs.writeFileSync(destPath, buffer);

        console.log(`  ✓ [${collectionName}] ${filename}`);
    } catch (err) {
        console.error(`  ✗ [${collectionName}] Failed to download: ${url}`);
        console.error(`    ${err.message}`);
    }
}


// ─────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────

/**
 * Backs up all Cloudinary assets referenced in a MongoDB collection.
 *
 * Fetches every document from the given Model, extracts image URLs
 * via the provided callback, and downloads any Cloudinary URLs to disk.
 *
 * @param {import("mongoose").Model} Model  - The Mongoose model to query.
 * @param {string}   collectionName         - Human-readable name used for the subfolder and logs.
 * @param {Function} extractUrls            - A function that receives a document and returns an array of URL strings.
 *
 * @example
 * await backupCollection(Gallery, "Gallery", (doc) => [doc.image]);
 */
export async function backupCollection(Model, collectionName, extractUrls) {
    const docs = await Model.find().lean();

    console.log(`\nBacking up "${collectionName}" — ${docs.length} document(s) found`);

    for (const doc of docs) {
        const urls = extractUrls(doc);

        if (!urls?.length) continue;

        for (const url of urls) {
            const isCloudinaryUrl = typeof url === "string" && url.includes("cloudinary");

            if (isCloudinaryUrl) {
                await downloadFile(url, collectionName);
            }
        }
    }

    console.log(`  Done — "${collectionName}" backup complete.\n`);
}
