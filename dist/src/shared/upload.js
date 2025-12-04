"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const IMAGE_EXTS = [".png", ".jpg", ".jpeg"];
const DOC_EXTS = [".pdf", ".doc", ".docx"];
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/"),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const name = `${Date.now()}-${(0, crypto_1.randomUUID)()}${ext}`;
        cb(null, name);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (file.fieldname === "profileImage") {
            return IMAGE_EXTS.includes(ext)
                ? cb(null, true)
                : cb(new Error("Invalid profileImage type; only PNG, JPG, JPEG allowed."));
        }
        if (file.fieldname === "attachments" || file.fieldname === "attachment") {
            return [...IMAGE_EXTS, ...DOC_EXTS].includes(ext)
                ? cb(null, true)
                : cb(new Error("Invalid attachment type; only PNG, JPG, JPEG, PDF, DOC, DOCX allowed."));
        }
        cb(new Error("Unexpected file field"));
    },
});
