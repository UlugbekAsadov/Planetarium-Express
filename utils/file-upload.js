const multer = require("multer");
const path = require("path");

// Set storage
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// upload
const upload = multer({
  storage,
  limits: { fileSize: 4000000 },
  fileFilter: checkFileType,
});

// check file type
function checkFileType(_, file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb("Error: You can only upload image files");
  }
}

module.exports = upload;
