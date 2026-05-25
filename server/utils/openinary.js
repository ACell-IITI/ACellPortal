import { readFile } from "node:fs/promises";
import path from "node:path";
import mime from "mime-types";



export const uploadToOpeninary = async (filePath, folder, apiKey, openinaryUrl) => {
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

    const mimeType = mime.lookup(ext) || "application/octet-stream";

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
