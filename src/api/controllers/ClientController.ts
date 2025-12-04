import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import fs from "fs/promises";
import path from "path";
import { ClientService } from "../../application/services/ClientService";
import { TYPES } from "../../shared/di/types";
import { CreateClientSchema } from "../../application/dto/CreateClient.dto";
import { UpdateClientSchema } from "../../application/dto/UpdateClient.dto";

@injectable()
export class ClientController {
  constructor(
    @inject(TYPES.ClientService) private readonly svc: ClientService
  ) {}

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = CreateClientSchema.parse(req.body);
      const files = req.files as {
        profileImage?: Express.Multer.File[];
        attachments?: Express.Multer.File[];
      };

      if (files?.profileImage?.length) {
        dto.profileImage = files.profileImage[0].path;
      }
      if (files?.attachments?.length) {
        dto.attachments = files.attachments.map((f) => f.path);
      }

      const client = await this.svc.createClient(dto);
      res.status(201).json(client);
    } catch (err) {
      next(err);
    }
  };

  public list = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const clients = await this.svc.listClients();
      res.json(clients);
    } catch (err) {
      next(err);
    }
  };

  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const client = await this.svc.getClient(req.params.id);
      res.json(client);
    } catch (err) {
      next(err);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = UpdateClientSchema.parse(req.body);
      const files = req.files as {
        profileImage?: Express.Multer.File[];
        attachments?: Express.Multer.File[];
      };

      const existing = await this.svc.getClient(req.params.id);
      if (files?.profileImage?.length && existing.profileImage) {
        await fs.unlink(path.resolve(existing.profileImage)).catch(() => {});
        dto.profileImage = files.profileImage[0].path;
      }

      if (files?.attachments?.length) {
        for (const f of files.attachments) {
          await this.svc.addAttachment(req.params.id, f.path);
        }
      }

      const updated = await this.svc.updateClient(req.params.id, dto);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.svc.deleteClient(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };

  public listAttachments = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const list = await this.svc.listAttachments(req.params.id);
      res.json(list);
    } catch (err) {
      next(err);
    }
  };

  public addAttachment = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const updated = await this.svc.addAttachment(req.params.id, file.path);
      res.status(201).json(updated);
    } catch (err) {
      next(err);
    }
  };

  public removeAttachmentById = async (
    req: Request<{ id: string; attachmentId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id: clientId, attachmentId } = req.params;

      const attachments = await this.svc.listAttachments(clientId);
      const found = attachments.find((a) => a.id === attachmentId);
      if (!found) {
        res.status(404).json({ error: "Attachment not found." });
        return;
      }

      await fs.unlink(path.resolve(found.path)).catch(() => {});

      const updated = await this.svc.removeAttachmentById(
        clientId,
        attachmentId
      );
      res.json(updated);
    } catch (err) {
      next(err);
    }
  };
}
