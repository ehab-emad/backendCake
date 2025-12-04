"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfilePicture = exports.uploadHotelImages = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/hotels/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    // No file size limit for uploads
    limits: {
        fileSize: Infinity, // No limit on file size
    },
    fileFilter: fileFilter,
});
exports.uploadHotelImages = exports.upload.fields([
    { name: 'images', maxCount: 10 },
]);
// Profile picture upload configuration
exports.uploadProfilePicture = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/profile-pictures/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, 'profile-' + uniqueSuffix + path_1.default.extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
    },
    fileFilter: fileFilter,
}).single('profilePicture');
