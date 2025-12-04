"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    ok(res, data) {
        return res.status(200).json({ success: true, data });
    }
    created(res, data) {
        return res.status(201).json({ success: true, data });
    }
    noContent(res) {
        return res.sendStatus(204);
    }
    badRequest(res, message = "Bad Request") {
        return res.status(400).json({ success: false, message });
    }
    unauthorized(res) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    forbidden(res) {
        return res.status(403).json({ success: false, message: "Forbidden" });
    }
    notFound(res, message = "Not Found") {
        return res.status(404).json({ success: false, message });
    }
    internalServerError(res, error) {
        const message = error instanceof Error ? error.message : "Internal Server Error";
        console.error("Internal Server Error:", error);
        return res.status(500).json({ success: false, message });
    }
    handleError(res, error) {
        return this.internalServerError(res, error);
    }
}
exports.BaseController = BaseController;
