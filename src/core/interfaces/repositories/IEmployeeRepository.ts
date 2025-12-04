import { Employee } from "../../../core/entities/Employee";

export interface IEmployeeRepository {
  create(emp: Employee): Promise<void>;
  findById(id: string): Promise<Employee | null>;
  findByAuthUserId(authUserId: string): Promise<Employee | null>;
  update(emp: Employee): Promise<void>;
  delete(id: string): Promise<void>;
}
