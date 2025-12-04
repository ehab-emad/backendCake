import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const maskStorage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    const uploadDir = `uploads/masks`;
    ensureDirExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
};

const maskUpload = multer({
  storage: maskStorage,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 3, // Maximum 3 image files (front, side, left)
  },
  fileFilter: fileFilter,
}).fields([
  { name: 'frontImage', maxCount: 1 },
  { name: 'sideImage', maxCount: 1 },
  { name: 'leftImage', maxCount: 1 },
]);

export const maskUploadMiddleware = (req: Request, res: any, next: any) => {
  maskUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 50MB' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Error uploading files' });
    }
    next();
  });
};

export const processMaskUploadedFiles = (req: Request) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const imageUrls: { front?: string; side?: string; left?: string } = {};

  if (files.frontImage && files.frontImage.length > 0) {
    imageUrls.front = `/uploads/masks/${files.frontImage[0].filename}`;
  }
  if (files.sideImage && files.sideImage.length > 0) {
    imageUrls.side = `/uploads/masks/${files.sideImage[0].filename}`;
  }
  if (files.leftImage && files.leftImage.length > 0) {
    imageUrls.left = `/uploads/masks/${files.leftImage[0].filename}`;
  }
  
  return imageUrls;
};
