import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadToOpeninary } from "./openinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function migrate({
  Model,
  displayField,
  imageField,
  folderName,
  apiKey,
  openinaryUrl,
}) {
  const allData = await Model.find();

  for (const data of allData) {
    let tempPath = "";

    const name = data[displayField];
    const oldUrl = data[imageField];

    try {
      console.log("Migrating:", name);

      // download image
      const imageResponse = await fetch(oldUrl);

      if (!imageResponse.ok) {
        throw new Error("Failed to download image");
      }

      // response -> buffer
      const buffer = Buffer.from(
        await imageResponse.arrayBuffer()
      );

      // extension
      const ext =
        path.extname(new URL(oldUrl).pathname) ||
        ".png";

      // temp file path
      tempPath = path.join(
        __dirname,
        `temp-${Date.now()}${ext}`
      );

      // save temp file
      fs.writeFileSync(tempPath, buffer);

      // upload
      const uploadRes = await uploadToOpeninary(
        tempPath,
        folderName,
        apiKey,
        openinaryUrl
      );

      // uploaded url
      const newUrl = uploadRes.files[0].url;

      // update db
      data[imageField] = openinaryUrl + newUrl;

      await data.save();

      console.log("Updated:", name);

    } catch (err) {
      console.error(
        `Failed for ${name}:`,
        err.message
      );

    } finally {
      // cleanup
      if (
        tempPath &&
        fs.existsSync(tempPath)
      ) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  console.log(`${folderName} Migration Complete`);
}