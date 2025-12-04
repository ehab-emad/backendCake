import { NextFunction, Request, Response } from "express";
import { injectable, inject } from "inversify";
import { CustomerService } from "../../application/services/CustomerService";
import { AuthService } from "../../application/services/AuthService";
import { IAuthRepository } from "../../core/interfaces/repositories/IAuthRepository";
import { TYPES } from "../../shared/di/types";
import { BaseController } from "./BaseController";
import { validationMiddleware } from "../middleware/validation.middleware";
import { authenticateJWT } from "../middleware/AuthMiddleware";
import { uploadProfilePicture } from "../../config/multer.config";
import fs from 'fs';
import path from 'path';
import {
  FilterCustomerSchema,
  FilterCustomerDTO,
} from "../../application/dto/FilterCustomer.dto";
import {
  CreateCustomerDTO,
  CreateCustomerSchema,
} from "../../application/dto/CreateCustomer.dto";
import {
  UpdateCustomerDTO,
  UpdateCustomerSchema,
} from "../../application/dto/UpdateCustomer.dto";
import {
  RegisterAndProfileSchema,
  type RegisterAndProfileDTO,
} from "../../application/dto/RegisterAndProfile.dto";
import {
  z,
} from "zod";

// إضافة schema للـ favorites
const FavoriteItemSchema = z.object({
  type: z.enum(["flight", "hotel", "package", "trip"]),
  id: z.string(),
});

type FavoriteItemDTO = z.infer<typeof FavoriteItemSchema>;

@injectable()
export class CustomerController extends BaseController {
  constructor(
    @inject(TYPES.CustomerService) private readonly service: CustomerService,
    @inject(TYPES.AuthRepository)
    private readonly authRepo: IAuthRepository,
    @inject(TYPES.AuthService)
    private readonly authService: AuthService
  ) {
    super();
  }

  public create = [
    validationMiddleware(RegisterAndProfileSchema, "body"),
    async (
      req: Request<unknown, unknown, RegisterAndProfileDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { firstName, lastName, email, password, ...profile } = req.body;

        const user = await this.authService.register(
          firstName,
          lastName,
          email,
          password
        );

        // If a file was uploaded, add its path to the profile data
        if (req.file) {
          profile.profilePicture = `/uploads/customers/profile-pictures/${req.file.filename}`;
        }

        const dto: CreateCustomerDTO = CreateCustomerSchema.parse({
          authUserId: user.id,
          ...profile,
          email
        });

        try {
          const customer = await this.service.createCustomer(user.id, dto);
          res.status(201).json(customer);
        } catch (error) {
          // If customer creation fails, delete the uploaded file
          if (req.file) {
            const filePath = path.join(process.cwd(), 'uploads/customers/profile-pictures', req.file.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
          throw error;
        }
      } catch (err) {
        next(err);
      }
    },
  ];

  public update = [
    async (
      req: Request<{ customerId: string }, unknown, UpdateCustomerDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { customerId } = req.params;
        const updateData = { ...req.body };
        
        // If a file was uploaded, add its path to the update data
        if (req.file) {
          // The file path is already set by multer in the route
          updateData.profilePicture = `/uploads/customers/profile-pictures/${req.file.filename}`;
          
          // If there was a previous profile picture, delete it
          const customer = await this.service.findById(customerId);
          if (customer?.profilePicture) {
            const oldImagePath = path.join(process.cwd(), customer.profilePicture);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
        }
        
        const updated = await this.service.updateCustomer(customerId, updateData);
        res.json(updated);
      } catch (err) {
        // If there was an error and a file was uploaded, delete it
        if (req.file) {
          const filePath = path.join(process.cwd(), 'uploads/customers/profile-pictures', req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        next(err);
      }
    },
  ];

  public getById = [
    authenticateJWT,
    async (req: Request<{ customerId: string }>, res: Response) => {
      try {
        const customer = await this.service.findById(req.params.customerId);
        const auth = await this.authRepo.findById(customer.authUserId);
        const payload = {
          ...customer,
          latitude: customer.latitude,
          longitude: customer.longitude,
          nationalId: customer.nationalId,
          nationalIdExpiry: customer.nationalIdExpiry,
          authUser: auth && {
            id: auth.id,
            firstName: auth.firstName!,
            lastName: auth.lastName!,
            email: auth.email!,
            phoneNumber: auth.phoneNumber ?? null,
          },
        };
        this.ok(res, payload);
      } catch (err) {
        this.handleError(res, err);
      }
    },
  ];

  public getByAuthUser = [
    authenticateJWT,
    async (req: Request<{ authUserId: string }>, res: Response) => {
      try {
        const customer = await this.service.findByAuthUserId(
          req.params.authUserId
        );
        this.ok(res, customer);
      } catch (err) {
        this.handleError(res, err);
      }
    },
  ];

  public list = [
    authenticateJWT,
    validationMiddleware(FilterCustomerSchema, "query"),
    async (
      req: Request<unknown, unknown, unknown, FilterCustomerDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const result = await this.service.list(req.query);
        
        // Enrich customer data with auth user info
        const enrichedData = await Promise.all(
          result.data.map(async (customer) => {
            const auth = await this.authRepo.findById(customer.authUserId);
            return {
              ...customer,
              latitude: customer.latitude,
              longitude: customer.longitude,
              nationalId: customer.nationalId,
              nationalIdExpiry: customer.nationalIdExpiry,
              authUser: auth && {
                id: auth.id,
                firstName: auth.firstName!,
                lastName: auth.lastName!,
                email: auth.email!,
                phoneNumber: auth.phoneNumber ?? null,
              },
            };
          })
        );

        this.ok(res, {
          data: enrichedData,
          total: result.total,
          page: result.page,
          limit: result.limit,
        });
      } catch (err) {
        next(err);
      }
    },
  ];

  public delete = [
    authenticateJWT,
    async (
      req: Request<{ customerId: string }>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        await this.service.deleteCustomer(req.params.customerId);
        res.sendStatus(204);
      } catch (err) {
        next(err);
      }
    },
  ];

  public upgradeToVIP = [
    authenticateJWT,
    async (req: Request<{ customerId: string }>, res: Response) => {
      try {
        const customer = await this.service.upgradeToVIP(req.params.customerId);
        this.ok(res, customer);
      } catch (err) {
        this.handleError(res, err);
      }
    },
  ];

  // دوال المفضلة (Favorites)
  public addToFavorites = [
    authenticateJWT,
    validationMiddleware(FavoriteItemSchema, "body"),
    async (req: Request<{ customerId: string }, unknown, FavoriteItemDTO>, res: Response) => {
      try {
        const { customerId } = req.params;
        const { type, id } = req.body;

        const customer = await this.service.addToFavorites(customerId, type as any, id);
        this.ok(res, {
          message: 'تم إضافة العنصر للمفضلة بنجاح',
          favorites: customer.favorites
        });
      } catch (err) {
        this.handleError(res, err);
      }
    },
  ];

  public removeFromFavorites = [
    authenticateJWT,
    validationMiddleware(FavoriteItemSchema, "body"),
    async (req: Request<{ customerId: string }, unknown, FavoriteItemDTO>, res: Response) => {
      try {
        const { customerId } = req.params;
        const { type, id } = req.body;

        const customer = await this.service.removeFromFavorites(customerId, type as any, id);
        this.ok(res, {
          message: 'تم إزالة العنصر من المفضلة بنجاح',
          favorites: customer.favorites
        });
      } catch (err) {
        this.handleError(res, err);
      }
    },
  ];

  public getFavorites = [
    authenticateJWT,
    async (req: Request<{ customerId: string }>, res: Response) => {
      try {
        const { customerId } = req.params;
        const favorites = await this.service.getFavorites(customerId);
        this.ok(res, { favorites });
      } catch (err) {
        this.handleError(res, err);
      }
    },
  ];

  public isFavorite = [
    authenticateJWT,
    validationMiddleware(FavoriteItemSchema, "body"),
    async (req: Request<{ customerId: string }, unknown, FavoriteItemDTO>, res: Response) => {
      try {
        const { customerId } = req.params;
        const { type, id } = req.body;

        const isFavorite = await this.service.isFavorite(customerId, type as any, id);
        this.ok(res, { isFavorite });
      } catch (err) {
        this.handleError(res, err);
      }
    },
  ];

  public clearFavorites = [
    authenticateJWT,
    async (req: Request<{ customerId: string }>, res: Response) => {
      try {
        const { customerId } = req.params;
        const customer = await this.service.clearFavorites(customerId);
        this.ok(res, {
          message: 'تم مسح جميع المفضلة بنجاح',
          favorites: customer.favorites
        });
      } catch (err) {
        this.handleError(res, err);
      }
    },
  ];
}
