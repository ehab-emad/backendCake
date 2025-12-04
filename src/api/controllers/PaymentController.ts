import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../shared/di/types";

import {
  CreatePaymentSchema,
  CreatePaymentDTO,
} from "../../application/dto/CreatePayment.dto";

import {
  UpdatePaymentSchema,
  UpdatePaymentDTO,
} from "../../application/dto/UpdatePayment.dto";
import {
  FilterPaymentSchema,
  FilterPaymentDTO,
} from "../../application/dto/FilterPayment.dto";
import {
  CreateStripeSessionSchema,
  CreateStripeSessionDTO,
} from "../../application/dto/StripeSession.dto";

import {
  CreateMamoPaymentSchema,
  CreateMamoPaymentDTO,
} from "../../application/dto/CreateMamoPayment.dto";

import {
  InitiatePaymentSchema,
  InitiatePaymentDTO,
} from "../../application/dto/InitiatePayment.dto";
import { PaymentService } from "../../application/services/PaymentService";
import { inject, injectable } from "inversify";
import { validationMiddleware } from "../middleware/validation.middleware";

@injectable()
export class PaymentController {
  constructor(
    @inject(TYPES.PaymentService) private readonly svc: PaymentService
  ) {}

  public create = [
    validationMiddleware(CreatePaymentSchema, "body"),
    async (
      req: Request<unknown, unknown, CreatePaymentDTO, unknown>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const payment = await this.svc.createPayment(req.body);
        res.status(201).json(payment);
      } catch (err) {
        next(err);
      }
    },
  ];

  public list = [
    validationMiddleware(FilterPaymentSchema, "query"),
    async (
      req: Request<unknown, unknown, unknown, FilterPaymentDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const result = await this.svc.listPayments(
          req.validatedQuery as FilterPaymentDTO
        );
        res.json(result);
      } catch (err) {
        next(err);
      }
    },
  ];

  public get = async (
    req: Request<{ id: string }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payment = await this.svc.getPayment(req.params.id);
      res.json(payment);
    } catch (err) {
      next(err);
    }
  };

  public update = [
    validationMiddleware(UpdatePaymentSchema, "body"),
    async (
      req: Request<{ id: string }, unknown, UpdatePaymentDTO, unknown>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const updated = await this.svc.updatePayment(req.params.id, req.body);
        res.json(updated);
      } catch (err) {
        next(err);
      }
    },
  ];

  public delete = async (
    req: Request<{ id: string }, unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.svc.deletePayment(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };

  public createStripeSession = [
    validationMiddleware(CreateStripeSessionSchema, "body"),
    async (
      req: Request<unknown, unknown, CreateStripeSessionDTO, unknown>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { sessionUrl } = await this.svc.createStripeSession(req.body);
        res.json({ sessionUrl });
      } catch (err) {
        next(err);
      }
    },
  ];

  public createMamoPayment = [
    validationMiddleware(CreateMamoPaymentSchema, "body"),
    async (
      req: Request<unknown, unknown, CreateMamoPaymentDTO, unknown>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { checkoutUrl } = await this.svc.createMamoPayment(req.body);
        res.json({ checkoutUrl });
      } catch (err) {
        next(err);
      }
    },
  ];

  public initiatePayment = [
    validationMiddleware(InitiatePaymentSchema, "body"),
    async (
      req: Request<unknown, unknown, InitiatePaymentDTO, unknown>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const result = await this.svc.initiatePayment(req.body);
        res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    },
  ];
}
