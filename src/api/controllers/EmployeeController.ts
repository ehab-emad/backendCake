import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { EmployeeService } from "../../application/services/EmployeeService";
import { IAuthRepository } from "../../core/interfaces/repositories/IAuthRepository";
import { TYPES } from "../../shared/di/types";
import { CreateEmployeeDTO } from "../../application/dto/CreateEmployee.dto";
import { UpdateEmployeeDTO } from "../../application/dto/UpdateEmployee.dto";


@injectable()
export class EmployeeController {
  constructor(
    @inject(TYPES.EmployeeService)
    private readonly service: EmployeeService,
    @inject(TYPES.AuthRepository)
    private readonly authRepo: IAuthRepository
  ) {}

  async createEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as CreateEmployeeDTO;
      const emp = await this.service.createEmployee(dto);
      res.status(201).json(emp);
    } catch (err) {
      next(err);
    }
  }


  async getEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const emp = await this.service.getEmployee(id);
      const auth = await this.authRepo.findById(emp.authUserId);
      res.json({
        ...emp,
        authUser: auth && {
          id: auth.id,
          firstName: auth.firstName!,
          lastName: auth.lastName!,
          email: auth.email!,
          phoneNumber: auth.phoneNumber ?? null,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const dto = req.body as UpdateEmployeeDTO;
      const updated = await this.service.updateEmployee(id, dto);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteEmployee(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await this.service.deleteEmployee(id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }

  async removeImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, imageId } = req.params;
      const remaining = await this.service.removeImage(id, imageId);
      res.json(remaining);
    } catch (err) {
      next(err);
    }
  }
}
