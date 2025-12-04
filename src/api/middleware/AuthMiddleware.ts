import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { container } from "../../shared/di/container";
import { TYPES } from "../../shared/di/types";
import { IAuthRepository } from "../../core/interfaces/repositories/IAuthRepository";

interface JwtPayload {
  userId: string;
}

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined.");
  }

  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.split(" ")[1];
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
  } catch {
    res.sendStatus(403);
    return;
  }

  const authRepo = container.get<IAuthRepository>(TYPES.AuthRepository);
  authRepo
    .findById(payload.userId)
    .then((user) => {
      if (!user) {
        res.sendStatus(403);
        return;
      }
      req.user = user as unknown as Express.User;
      next();
    })
    .catch((err) => next(err));
}
