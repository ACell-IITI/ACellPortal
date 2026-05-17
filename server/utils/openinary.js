import { readFile } from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.OPENINARY_API_KEY;
const openinaryUrl = process.env.OPENINARY_URL;

export const uploadToOpeninary = async (filePath, folder) => {
  try {
    if (!filePath || !folder) {
      throw new Error("filePath or folder missing");
    }

    if (!apiKey) {
      throw new Error("Missing OPENINARY_API_KEY");
    }

    const bytes = await readFile(filePath);
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName).toLowerCase();

    let mimeType = "application/octet-stream";

    if (ext === ".png") mimeType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
    else if (ext === ".webp") mimeType = "image/webp";

    const file = new File([bytes], fileName, {
      type: mimeType,
    });

    const form = new FormData();
    form.append("files", file);
    form.append("folder", folder);

    const res = await fetch(`${openinaryUrl}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: form,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      throw new Error(data.message || "Upload failed");
    }

    return data;
  } catch (err) {
    console.error("Openinary upload error:", err);
    throw err;
  }
};
