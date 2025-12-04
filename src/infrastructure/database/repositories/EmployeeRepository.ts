import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { EmployeeEntity } from "../models/Employee.model";
import { IEmployeeRepository } from "../../../core/interfaces/repositories/IEmployeeRepository";
import { Employee } from "../../../core/entities/Employee";

@injectable()
export class EmployeeRepository implements IEmployeeRepository {
  private readonly repo: Repository<EmployeeEntity>;

  constructor() {
    this.repo = AppDataSource.getRepository(EmployeeEntity);
  }

  async create(emp: Employee): Promise<void> {
    const ent = this.repo.create({
      id: emp.id,
      authUserId: emp.authUserId,
      role: emp.role,
      active: emp.active,
      address: emp.address ?? undefined,
      profileImage: emp.profileImage ?? undefined,
    });
    await this.repo.save(ent);
  }

  async findById(id: string): Promise<Employee | null> {
    const e = await this.repo.findOneBy({ id });
    if (!e) return null;
    return new Employee(
      e.id,
      e.authUserId,
      e.address ?? null,
      e.role,
      e.active,
      e.profileImage ?? undefined
    );
  }


  public async findByAuthUserId(authUserId: string): Promise<Employee | null> {
    const e = await this.repo.findOneBy({ authUserId });
    if (!e) return null;
    return new Employee(
      e.id,
      e.authUserId,
      e.address ?? null,
      e.role,
      e.active,
      e.profileImage ?? undefined
    );
  }

  async update(emp: Employee): Promise<void> {
    await this.repo.update(emp.id, {
      role: emp.role,
      active: emp.active,
      address: emp.address ?? undefined,
      profileImage: emp.profileImage ?? undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
