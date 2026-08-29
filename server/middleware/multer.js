import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg|avif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = file.mimetype.startsWith('image/');
  if (ext || mime) cb(null, true);
  else cb(new Error('Only image files (JPG, PNG, WEBP, GIF) are allowed'));
};

const upload = multer({ storage, fileFilter });

export default upload;

