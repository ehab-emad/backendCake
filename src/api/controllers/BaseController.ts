import { Response } from "express";

export class BaseController {
  protected ok<T>(res: Response, data: T): Response {
    return res.status(200).json({ success: true, data });
  }

  protected created<T>(res: Response, data: T): Response {
    return res.status(201).json({ success: true, data });
  }

  protected noContent(res: Response): Response {
    return res.sendStatus(204);
  }

  protected badRequest(res: Response, message = "Bad Request"): Response {
    return res.status(400).json({ success: false, message });
  }

  protected unauthorized(res: Response): Response {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  protected forbidden(res: Response): Response {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  protected notFound(res: Response, message = "Not Found"): Response {
    return res.status(404).json({ success: false, message });
  }

  protected internalServerError(res: Response, error: unknown): Response {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("Internal Server Error:", error);
    return res.status(500).json({ success: false, message });
  }

  protected handleError(res: Response, error: unknown): Response {
    return this.internalServerError(res, error);
  }
}
