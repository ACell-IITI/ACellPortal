import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {uploadToOpeninary} from "./openinary.js";

import AllData from "../models/Mentorship_model.js"    //change to mongodb model in which you want to change the urls

const apiKey = "wHMdTvQNdxDLgCVZQyzwxpBiNRxdKEgJcxuqKZQoYzHYsINRmEVUXJHsAFITyuLw";  //change to your openinary api key
const openinaryUrl = "http://localhost:3000";                            //change to your openinary base url

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await mongoose.connect("mongodb://127.0.0.1:27017/Acell");      //change to your mongodb uri

async function migrateImages() {
  const allData = await AllData.find();

  for (const data of allData) {
  
    let tempPath = "";
    const name = data.name                             // change to appropriate field name to display in logs
    const old_url = data.profilePic                        // change to field name of the url 

    try {
      console.log("Migrating:", name);   

      

      //downloading existing image
      const imageResponse = await fetch(old_url);  

      if (!imageResponse.ok) {
        throw new Error("Failed to download image");
      }

      //converting response to buffer
      const buffer = Buffer.from(
        await imageResponse.arrayBuffer()
      );

      //getting extension from original url
      const ext =
        path.extname(new URL(old_url).pathname) ||
        ".png";

      //creating temp file
      tempPath = path.join(
        __dirname,
        `temp-${Date.now()}${ext}`                  //give required name of the image to store in openinary
      );

      //saving temp file
      fs.writeFileSync(tempPath, buffer);

      //uploading to openinary
      const uploadRes = await uploadToOpeninary(
        tempPath,
        "Mentors",                       //give required name of the image folder for openinary
        apiKey,
        openinaryUrl
      );

      //getting uploaded image url
      const newUrl = uploadRes.files[0].url;

      //updating db
      data.profilePic = openinaryUrl+ newUrl;             //change to url field to be updated

      await data.save();

      console.log("Updated:", name);

    } catch (err) {
      console.error(
        `Failed for ${name}:`,    
        err.message
      );

    } finally {
      //cleaning up temp file
      if (
        tempPath &&
        fs.existsSync(tempPath)
      ) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  console.log("Migration complete");
}

migrateImages()
  .then(() => {
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
  