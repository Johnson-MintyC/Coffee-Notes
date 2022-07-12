require("dotenv").config();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const CloudinaryStorage =
  require("multer-storage-cloudinary").CloudinaryStorage;

cloudinary.config();

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
  }),
});

console.log(cloudinary.config());
module.exports = upload;
