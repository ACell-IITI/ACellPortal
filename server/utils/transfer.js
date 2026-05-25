import mongoose from "mongoose";
import "dotenv/config";

import AlumniContributors from "../models/AlumniContribution.js";
import Gallery from "../models/Gallery.js";
import Sponsors from "../models/Sponsors.js";
import KYA from "../models/KYA_model.js";
import Mentors from "../models/Mentorship_model.js";
import Program from "../models/Program_model.js";

//import Newsletter from "../models/Newsletter_model.js";
//import Magazine from "../models/Magazine_model.js";
//import Yearbook from "../models/Yearbook_model.js";

import { migrate } from "./migrate_to_openinary.js";

const apiKey = process.env.OPENINARY_API_KEY;
const openinaryUrl = process.env.OPENINARY_URL;

async function runMigrations() {
  try {
    await mongoose.connect(process.env.MONGODB_LINK);

    // sponsors
    await migrate({
      Model: Sponsors,
      displayField: "name",
      imageField: "icon",
      folderName: "Sponsor_icons",
      apiKey,
      openinaryUrl,
    });


    // mentors
    await migrate({
      Model: Mentors,
      displayField: "name",
      imageField: "profilePic",
      folderName: "Mentor_profiles",
      apiKey,
      openinaryUrl,
    });

    // gallery
    await migrate({
      Model: Gallery,
      displayField: "_id",
      imageField: "image",
      folderName: "Gallery_images",
      apiKey,
      openinaryUrl
    });

    //KYA
    await migrate({
      Model: KYA,
      displayField: "Name",
      imageField: "profilePic",
      folderName: "KYA_profiles",
      apiKey,
      openinaryUrl
    });
    

    //alumni Contri
    await migrate({
      Model: AlumniContributors,
      displayField: "name",
      imageField: "photo",
      folderName: "Alumni_contributors_pics",
      apiKey,
      openinaryUrl
    });

    //programs
    await migrate({
      Model: Program,
      displayField: "title",
      imageField: "image",
      folderName: "Event_programs",
      apiKey,
      openinaryUrl
    });
/*
    //newsletters
    await migrate({
      Model: Newsletter,
      displayField: "title",
      imageField: "pdfUrl",
      folderName: "Newsletters",
      apiKey,
      openinaryUrl
    });
    
    //magazines
    await migrate({
      Model: Magazine,
      displayField: "title",
      imageField: "pdfUrl",
      folderName: "Magazines",
      apiKey,
      openinaryUrl
    });

  
    //yearbook
    await migrateImages({
      Model: Yearbook,
      displayField: "title",
      imageField: "pdfUrl",
      folderName: "YearBooks",
      apiKey,
      openinaryUrl
    });

*/

    console.log("All migrations completed");

  } catch (err) {
    console.error(err);

  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

runMigrations();