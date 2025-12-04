import { EmployeeImage } from "../../../core/entities/EmployeeImage";

export interface IEmployeeImageRepository {
  listForEmployee(employeeId: string): Promise<EmployeeImage[]>;
  add(employeeId: string, path: string): Promise<EmployeeImage>;
  removeById(imageId: string): Promise<void>;
}
