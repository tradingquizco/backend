// utils/uploadConfig.js
import multer from "multer";
import path from "path";

// Set up storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    console.log("file")
    console.log(file)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname) + `.${file.mimetype.split('/')[1]}`
    ); // Unique filename
  },
});

// Create the multer upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // Specify allowed MIME types

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('File type not supported!'), false); // Reject file if type is not supported
    }
    cb(null, true); // Accept the file
},
});
