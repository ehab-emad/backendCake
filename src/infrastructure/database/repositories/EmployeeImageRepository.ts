import { injectable } from "inversify";
import { AppDataSource } from "../../config/database.config";
import { EmployeeImageEntity } from "../models/EmployeeImage.model";
import { IEmployeeImageRepository } from "../../../core/interfaces/repositories/IEmployeeImageRepository";
import { EmployeeImage } from "../../../core/entities/EmployeeImage";
import { v4 as uuid } from "uuid";

@injectable()
export class EmployeeImageRepository implements IEmployeeImageRepository {
  private repo = AppDataSource.getRepository(EmployeeImageEntity);

  async listForEmployee(employeeId: string): Promise<EmployeeImage[]> {
    const ents = await this.repo.find({ where: { employeeId } });
    return ents.map((e) => new EmployeeImage(e.id, e.employeeId, e.path));
  }

  async add(employeeId: string, path: string): Promise<EmployeeImage> {
    const ent = this.repo.create({ id: uuid(), employeeId, path });
    const saved = await this.repo.save(ent);
    return new EmployeeImage(saved.id, saved.employeeId, saved.path);
  }

  async removeById(imageId: string): Promise<void> {
    await this.repo.delete(imageId);
  }
}
