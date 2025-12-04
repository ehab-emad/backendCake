import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodTypeAny, ZodError } from "zod";

declare module "express-serve-static-core" {
  interface Request {
    validatedQuery?: unknown;
    validatedParams?: unknown;
  }
}

type Location = "body" | "query" | "params";

export function validationMiddleware(
  schema: ZodTypeAny,
  loc: Location = "body"
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    let toValidate: unknown;
    if (loc === "body") {
      toValidate = req.body;
    } else if (loc === "query") {
      toValidate = req.query;
    } else {
      toValidate = req.params;
    }

    const result = schema.safeParse(toValidate);
    if (!result.success) {
      const formatted = (result.error as ZodError).format();
      res.status(400).json({ errors: formatted });
      return;
    }

    if (loc === "body") {
      req.body = result.data;
    } else if (loc === "query") {
      req.validatedQuery = result.data;
    } else {
      req.validatedParams = result.data;
    }
    next();
  };
}
