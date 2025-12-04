"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processUploadedFiles = exports.uploadHotelImages = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directory exists
const ensureDirExists = (dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
};
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // Get the upload type from the URL or request body
        const uploadType = req.path.includes('room') ? 'rooms' :
            req.path.includes('flight') ? 'flights' : 'hotels';
        const uploadDir = `uploads/${uploadType}`;
        // Create directory if it doesn't exist
        ensureDirExists(uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, uniqueSuffix + ext);
    },
});
// File filter for images only
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
};
// Initialize upload with larger file size limit
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 10, // Maximum number of files
    },
    fileFilter: fileFilter,
}).array('images', 10); // 'images' is the field name, max 10 files
// Middleware to handle file uploads
const uploadHotelImages = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            // A Multer error occurred when uploading
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File too large. Maximum size is 50MB' });
            }
            return res.status(400).json({ error: err.message });
        }
        else if (err) {
            // An unknown error occurred
            console.error('File upload error:', err);
            return res.status(500).json({ error: 'Error uploading files' });
        }
        // Everything went fine
        next();
    });
};
exports.uploadHotelImages = uploadHotelImages;
const processUploadedFiles = (req) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return [];
    }
    // In a real application, you would upload these files to a cloud storage service
    // and return the URLs. For now, we'll just return the file paths.
    return req.files.map(file => ({
        originalname: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        // In production, you would return the URL where the file is accessible
        // url: `https://your-storage-bucket.com/${file.filename}`
    }));
};
exports.processUploadedFiles = processUploadedFiles;
