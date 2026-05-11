import multer from "multer";

import {
  CloudinaryStorage
} from "multer-storage-cloudinary";

import cloudinary from "../Config/cloudinary.js";


const storage = new CloudinaryStorage({

  cloudinary,

  params: async (req, file) => ({

    folder: "CrowdFunding",

    allowed_formats: [
      "jpg",
      "png",
      "jpeg",
      "webp",
      "heic"
    ]

  })

});


export const upload = multer({
  storage
});