import multer, { FileFilterCallback } from "multer";
import path from "path";
import { randomUUID } from "crypto";

const IMAGE_EXTS = [".png", ".jpg", ".jpeg"];
const DOC_EXTS = [".pdf", ".doc", ".docx"];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${randomUUID()}${ext}`;
    cb(null, name);
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.fieldname === "profileImage") {
      return IMAGE_EXTS.includes(ext)
        ? cb(null, true)
        : cb(
            new Error("Invalid profileImage type; only PNG, JPG, JPEG allowed.")
          );
    }

    if (file.fieldname === "attachments" || file.fieldname === "attachment") {
      return [...IMAGE_EXTS, ...DOC_EXTS].includes(ext)
        ? cb(null, true)
        : cb(
            new Error(
              "Invalid attachment type; only PNG, JPG, JPEG, PDF, DOC, DOCX allowed."
            )
          );
    }

    cb(new Error("Unexpected file field"));
  },
});
