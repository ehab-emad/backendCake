import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";
import { TamaraService } from "../../application/services/TamaraService";

import { validationMiddleware } from "../middleware/validation.middleware";
import {
  CreateTamaraOrderDTO,
  CreateTamaraOrderSchema,
  CancelTamaraOrderDTO,
  CancelTamaraOrderSchema,
  RefundTamaraOrderSchema,
  RefundTamaraOrderDTO,
  CaptureTamaraOrderSchema,
  CaptureTamaraOrderDTO,

} from "../../application/dto/TamaraOrder.dto";
import { TamaraClient } from "../../infrastructure/tamara/client";
import { z } from "zod";

@injectable()
export class TamaraController {
  private readonly client = new TamaraClient();
  constructor(
    @inject(TYPES.TamaraService)
    private readonly tamaraService: TamaraService
  ) {}

  public createOrder = [
    validationMiddleware(CreateTamaraOrderSchema, "body"),
    async (
      req: Request<unknown, unknown, CreateTamaraOrderDTO, unknown>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        console.log(res.status)
        const { checkoutUrl } = await this.tamaraService.createOrder(req.body);
        res.status(201).json({ checkoutUrl });
      } catch (err) {
        next(err);
      }
    },
  ];
  public refundOrder = [
  validationMiddleware(RefundTamaraOrderSchema, "body"),
  async (
    req: Request<unknown, unknown, RefundTamaraOrderDTO, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.tamaraService.refundOrder(req.body);
      res.status(200).json({ message: "Refund processed successfully" });
    } catch (err) {
      console.log("Refund error:", err);
      next(err);
    }
  },
];
public cancelOrder = [
  validationMiddleware(CancelTamaraOrderSchema, "body"),
  async (
    
    req: Request<unknown, unknown, CancelTamaraOrderDTO, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("BODY:", req.body); // لازم تشوفه قبل الفاليديشن

    try {
      await this.tamaraService.cancelOrder(req.body);
      res.status(200).json({ message: "Order cancelled successfully" });
    } catch (err) {
      console.log(err)
      console.log("BODY:", req.body); // لازم تشوفه قبل الفاليديشن

      next(err);
    }
  },
];
public authoriseOrder = [
  async (
    req: Request<{ orderId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { orderId } = req.params;
      await this.tamaraService.authoriseOrder(orderId);
      res.status(200).json({ message: "Order authorised successfully" });
    } catch (err) {
      next(err);
    }
  },
];
public captureOrder = [
  validationMiddleware(CaptureTamaraOrderSchema, "body"),
  async (
    req: Request<{ orderId: string }, unknown, Omit<CaptureTamaraOrderDTO, "orderId">>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { orderId } = req.params;
      const dto = { ...req.body, orderId };
      await this.tamaraService.captureOrder(dto);
      res.status(200).json({ message: "Order captured successfully" });
    } catch (err) {
      next(err);
    }
  },
];



}
