import { injectable, inject } from "inversify";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import type { DataSource, DeepPartial } from "typeorm";
import { NotFoundException } from "../exceptions/NotFoundException";
import { IEmployeeRepository } from "../../core/interfaces/repositories/IEmployeeRepository";
import { IEmployeeImageRepository } from "../../core/interfaces/repositories/IEmployeeImageRepository";
import { AuthService } from "./AuthService";
import { Employee } from "../../core/entities/Employee";
import { EmployeeImage } from "../../core/entities/EmployeeImage";
import { TYPES } from "../../shared/di/types";

import { EmployeeEntity } from "../../infrastructure/database/models/Employee.model";
import { EmployeeImageEntity } from "../../infrastructure/database/models/EmployeeImage.model";
import { AuthEntity } from "../../infrastructure/database/models/Auth.model";
import { IAuthRepository } from "../../core/interfaces/repositories/IAuthRepository";

@injectable()
export class EmployeeService {
  constructor(
    @inject(TYPES.EmployeeRepository)
    private readonly empRepo: IEmployeeRepository,

    @inject(TYPES.EmployeeImageRepository)
    private readonly imgRepo: IEmployeeImageRepository,

    @inject(TYPES.AuthService)
    private readonly authSvc: AuthService,

    @inject(TYPES.AuthRepository)
    private readonly authRepo: IAuthRepository,

    @inject("DataSource")
    private readonly dataSource: DataSource
  ) {}

  public async createEmployee(dto: {
    address?: string;
    profileImage?: string;
    role: string;
    active?: boolean;
    images?: string[];
    email?: string;
    password?: string;
    phoneNumber?: string;
  }): Promise<Employee> {
    const employeeId = uuid();
    let authUserId: string;

    await this.dataSource.transaction(async (manager) => {
      const authRepo = manager.getRepository(AuthEntity);

      if (dto.email && dto.password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(dto.password, salt);

        const authUser = await authRepo.save({
          id: uuid(),
          email: dto.email,
          passwordHash: hash,
          phoneNumber: undefined,
          provider: "local",
          providerId: undefined,
          phoneVerified: false,
        } as DeepPartial<AuthEntity>);

        authUserId = authUser.id;
      } else if (dto.phoneNumber) {
        let authUser = await authRepo.findOneBy({
          phoneNumber: dto.phoneNumber,
        });
        if (!authUser) {
          authUser = await authRepo.save({
            id: uuid(),
            email: undefined,
            passwordHash: undefined,
            phoneNumber: dto.phoneNumber,
            provider: "phone",
            providerId: undefined,
            phoneVerified: false,
          } as DeepPartial<AuthEntity>);
        }
        authUserId = authUser.id;
      } else {
        throw new Error("Either (email+password) or phoneNumber is required");
      }

      await manager.getRepository(EmployeeEntity).save({
        id: employeeId,
        authUserId,
        address: dto.address ?? null,
        profileImage: dto.profileImage ?? null,
        role: dto.role,
        active: dto.active ?? true,
      } as DeepPartial<EmployeeEntity>);

      if (dto.images && dto.images.length) {
        const imgRepo = manager.getRepository(EmployeeImageEntity);
        for (const path of dto.images) {
          await imgRepo.save({
            id: uuid(),
            employeeId,
            path,
          } as DeepPartial<EmployeeImageEntity>);
        }
      }
    });

    return this.getEmployee(employeeId);
  }

  public async getEmployee(id: string): Promise<Employee> {
    const e = await this.empRepo.findById(id);
    if (!e) throw new Error("Employee not found");
    e.images = await this.imgRepo.listForEmployee(id);
    return e;
  }

  public async updateEmployee(
    id: string,
    dto: {
      address?: string;
      profileImage?: string;
      role?: string;
      active?: boolean;
      newImages?: string[];
    }
  ): Promise<Employee> {
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(EmployeeEntity).update(id, {
        address: dto.address,
        profileImage: dto.profileImage,
        role: dto.role,
        active: dto.active,
      } as DeepPartial<EmployeeEntity>);

      if (dto.newImages) {
        const imgRepo = manager.getRepository(EmployeeImageEntity);
        for (const path of dto.newImages) {
          await imgRepo.save({
            id: uuid(),
            employeeId: id,
            path,
          } as DeepPartial<EmployeeImageEntity>);
        }
      }
    });

    return this.getEmployee(id);
  }

  public async findByAuthUserId(authUserId: string): Promise<Employee> {
    const partial = await this.empRepo.findByAuthUserId(authUserId);
    if (!partial) throw new NotFoundException("Employee not found");
    return this.getEmployee(partial.id);
  }

  public async deleteEmployee(id: string): Promise<void> {
    const employee = await this.empRepo.findById(id);
    if (!employee) {
      throw new NotFoundException("Employee not found");
    }
    await this.empRepo.delete(id);
    await this.authRepo.delete(employee.authUserId);
  }

  public async removeImage(
    employeeId: string,
    imageId: string
  ): Promise<EmployeeImage[]> {
    await this.imgRepo.removeById(imageId);
    return this.imgRepo.listForEmployee(employeeId);
  }
}
