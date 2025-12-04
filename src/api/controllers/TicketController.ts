import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import multer from "multer";
import { validationMiddleware } from "../middleware/validation.middleware";
import { TYPES } from "../../shared/di/types";

import { TicketService } from "../../application/services/TicketService";
import { TicketMessageService } from "../../application/services/TicketMessageService";

import {
  CreateTicketSchema,
  CreateTicketDTO,
} from "../../application/dto/CreateTicket.dto";
import {
  UpdateTicketSchema,
  UpdateTicketDTO,
} from "../../application/dto/UpdateTicket.dto";

@injectable()
export class TicketController {
  private upload = multer({ dest: "uploads/tickets/" });

  constructor(
    @inject(TYPES.TicketService)
    private readonly ticketSvc: TicketService,

    @inject(TYPES.TicketMessageService)
    private readonly msgSvc: TicketMessageService
  ) {}

  public create = [
    this.upload.array("attachments", 10),
    validationMiddleware(CreateTicketSchema, "body"),
    async (
      req: Request<unknown, unknown, CreateTicketDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const dto = CreateTicketSchema.parse(req.body);

        const files = (req.files as Express.Multer.File[]) || [];
        if (files.length) {
          dto.attachments = files.map((f) => f.path);
        }

        const ticket = await this.ticketSvc.createTicket(dto);

        await this.msgSvc.addMessage(
          ticket.id,
          dto.clientId ?? null,
          dto.userId ?? null,
          dto.message
        );

        const history = await this.msgSvc.listMessages(ticket.id);

        res.status(201).json({
          ...ticket,
          messages: history,
        });
      } catch (err) {
        next(err);
      }
    },
  ];

  public list = async (
    req: Request<unknown, unknown, unknown, { clientId?: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const clientId = req.query.clientId;
      const tickets = await this.ticketSvc.listTickets(clientId);
      const enriched = await Promise.all(
        tickets.map(async (t) => ({
          ...t,
          messages: await this.msgSvc.listMessages(t.id),
        }))
      );
      res.json(enriched);
    } catch (err) {
      next(err);
    }
  };

  public get = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ticket = await this.ticketSvc.getTicket(req.params.id);
      const history = await this.msgSvc.listMessages(ticket.id);
      res.json({
        ...ticket,
        messages: history,
      });
    } catch (err) {
      next(err);
    }
  };

  public update = [
    this.upload.array("newAttachments", 10),
    validationMiddleware(UpdateTicketSchema, "body"),
    async (
      req: Request<{ id: string }, unknown, UpdateTicketDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const dto = UpdateTicketSchema.parse(req.body);

        const files = (req.files as Express.Multer.File[]) || [];
        if (files.length) {
          dto.newAttachments = files.map((f) => f.path);
        }

        const updated = await this.ticketSvc.updateTicket(req.params.id, dto);

        if (dto.message) {
          await this.msgSvc.addMessage(
            updated.id,
            dto.clientId ?? null,
            dto.userId ?? null,
            dto.message
          );
        }

        const history = await this.msgSvc.listMessages(updated.id);
        res.json({
          ...updated,
          messages: history,
        });
      } catch (err) {
        next(err);
      }
    },
  ];

  public delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.ticketSvc.deleteTicket(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };
}
