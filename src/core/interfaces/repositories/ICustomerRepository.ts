import { Customer } from "../../entities/Customer";
import { FilterCustomerDTO } from "../../../application/dto/FilterCustomer.dto";

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByAuthUserId(authUserId: string): Promise<Customer | null>;
  create(customer: Customer): Promise<void>;
  update(customer: Customer): Promise<void>;
  delete(id: string): Promise<void>;

  findAndCount(filters: FilterCustomerDTO): Promise<[Customer[], number]>;
}
