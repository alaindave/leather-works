const fs = require("fs");
const path = require("path");

const PHOTO_DIR = path.join(process.cwd(), "storage", "employees_photos");

function ensureEmployeePhotoDirectory() {
  console.log("EMPLOYEE PHOTOS FOLDER CREATED");

  fs.mkdirSync(PHOTO_DIR, {
    recursive: true,
  });
}

module.exports = {
  PHOTO_DIR,
  ensureEmployeePhotoDirectory,
};
