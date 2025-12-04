// src/api/controllers/MimoController.ts
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../shared/di/types";

import { validationMiddleware } from "../middleware/validation.middleware";
import { MimoService } from "../../application/services/mimoService";
import { CancelMimoOrderSchema, CaptureMimoOrderSchema, CreateMamoLinkDTO, CreateMamoLinkSchema, CreateMimoOrderSchema, RefundMimoOrderSchema } from "../../application/dto/mimoOrder.dto";

@injectable()
export class MimoController {
  constructor(
    @inject(TYPES.MimoService)
    private readonly mimoService: MimoService
  ) {}


  public createPaymentLink = [
    validationMiddleware(CreateMamoLinkSchema, "body"),
    async (
      req: Request<unknown, unknown, CreateMamoLinkDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const link = await this.mimoService.createPaymentLink(req.body);
        res.status(201).json(link);
      } catch (err) {
        next(err);
      }
    },
  ];
  
  public createOrder = [
    validationMiddleware(CreateMamoLinkSchema, "body"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.mimoService.createPaymentLink(req.body);
        res.status(201).json(data);
      } catch (err) {
        next(err);
      }
    },
  ];
public captureOrder = [
  validationMiddleware(CaptureMimoOrderSchema, "body"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chargeId = req.params.chargeId; // أو paymentId لو لسه مش عدلته
      const dto = req.body;

      // ✅ Debug Logs
      console.log("🔹 Incoming Capture Request:");
      console.log("Charge ID:", chargeId);
      console.log("Body (DTO):", dto);

      const data = await this.mimoService.captureOrder(chargeId, dto);
      res.status(200).json(data);
    } catch (err: any) {
      console.error("❌ Capture Error:", err.response?.data || err.message);

      res.status(err.response?.status || 500).json({
        message: err.response?.data?.messages?.[0] || err.message || "Unknown error",
        code: err.response?.data?.error_code || "unknown_error",
      });
    }
  },
];



  public refundOrder = [
    validationMiddleware(RefundMimoOrderSchema, "body"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.mimoService.refundOrder(req.body);
        res.status(200).json(data);
      } catch (err) {
        next(err);
      }
    },
  ];


  public getPaymentLink = async (
    req: Request<{ linkId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const link = await this.mimoService.getLinkDetails(req.params.linkId);
      res.status(200).json(link);
    } catch (err) {
      next(err);
    }
  };

  // public cancelOrder = [
  //   validationMiddleware(CancelMimoOrderSchema, "body"),
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const data = await this.mimoService.cancelOrder(req.body);
  //       res.status(200).json(data);
  //     } catch (err) {
  //       next(err);
  //     }
  //   },
  // ];

  

  public getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.mimoService.getOrder(req.params.paymentId);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
}
