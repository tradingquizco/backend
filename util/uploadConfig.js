// utils/uploadConfig.js
import multer from "multer";
import path from "path";

// Set up storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    console.log(path.extname(file.originalname))
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + `.${file.mimetype.split("/")[1]}`
    ); // Unique filename
  },
});

// Create the multer upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('File type not supported!'), false);
    }
    cb(null, true);
},
});
