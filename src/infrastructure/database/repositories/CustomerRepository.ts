import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { CustomerEntity } from "../models/Customer.model";
import { ICustomerRepository } from "../../../core/interfaces/repositories/ICustomerRepository";
import { Customer } from "../../../core/entities/Customer";
import { FilterCustomerDTO } from "../../../application/dto/FilterCustomer.dto";

@injectable()
export class CustomerRepository implements ICustomerRepository {
  private get repo(): Repository<CustomerEntity> {
    if (!AppDataSource.isInitialized) {
      throw new Error("Data source is not initialized");
    }
    return AppDataSource.getRepository(CustomerEntity);
  }

  async findById(id: string): Promise<Customer | null> {
    const ent = await this.repo
      .createQueryBuilder("c")
      .innerJoinAndSelect("c.authUser", "u")
      .where("c.id = :id", { id })
      .getOne();
    return ent ? this.toDomain(ent) : null;
  }

  async findByAuthUserId(authUserId: string): Promise<Customer | null> {
    const ent = await this.repo
      .createQueryBuilder("c")
      .innerJoinAndSelect("c.authUser", "u")
      .where("c.auth_user_id = :authUserId", { authUserId })
      .getOne();
    return ent ? this.toDomain(ent) : null;
  }

  async create(customer: Customer): Promise<void> {
    await this.repo.save(this.toEntity(customer));
  }

  async update(customer: Customer): Promise<void> {
    await this.repo.update(customer.id, this.toEntity(customer));
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findAndCount(
    filters: FilterCustomerDTO
  ): Promise<[Customer[], number]> {
    const { search, page = 1, limit = 20 } = filters;

    const qb = this.repo
      .createQueryBuilder("c")
      .innerJoinAndSelect("c.authUser", "u");

    if (search) {
      const like = `%${search}%`;
      qb.andWhere(
        "(u.first_name ILIKE :like OR u.last_name ILIKE :like OR c.phone_number ILIKE :like)",
        { like }
      );
    }

    const total = await qb.getCount();
    const dataEnts = await qb
      .orderBy("c.createdAt", "DESC")
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit))
      .getMany();

    return [dataEnts.map((e) => this.toDomain(e)), total];
  }

  private toDomain(ent: CustomerEntity): Customer {
    const customer = new Customer(
      ent.id,
      ent.authUserId,
      ent.customerType as "VIP" | "Regular",
      ent.nationality,
      ent.latitude,
      ent.longitude,
      ent.passportNumber,
      ent.nationalId,
      ent.nationalIdExpiry,
      ent.addressLine1,
      ent.addressLine2,
      ent.city,
      ent.customername,
      ent.email,
      ent.phoneNumber,
      ent.country,
      // Google OAuth fields
      ent.profilePicture,
      ent.locale,
      ent.gender,
      ent.firstName,
      ent.lastName,
      ent.registrationDate,
      ent.expirationDate,
      ent.dateOfBirth,
      ent.passportExpiry,
      (ent.favorites || []) as Array<{type: 'flight' | 'hotel' | 'package' | 'trip', id: string}>
    );
    return customer;
  }

  private toEntity(c: Customer): CustomerEntity {
    const ent = new CustomerEntity();
    ent.id = c.id;
    ent.authUserId = c.authUserId;
    ent.customerType = c.customerType;
    ent.nationality = c.nationality;
    ent.latitude = c.latitude;
    ent.longitude = c.longitude;
    ent.passportNumber = c.passportNumber;
    ent.nationalId = c.nationalId;
    ent.nationalIdExpiry = c.nationalIdExpiry;
    ent.addressLine1 = c.addressLine1;
    ent.addressLine2 = c.addressLine2;
    ent.city = c.city;
    ent.customername = c.customername;
    ent.email = c.email;
    ent.phoneNumber = c.phoneNumber;
    ent.country = c.country;
    ent.registrationDate = c.registrationDate;
    ent.expirationDate = c.expirationDate;
    ent.dateOfBirth = c.dateOfBirth;
    ent.passportExpiry = c.passportExpiry;
    // Google OAuth fields
    ent.profilePicture = c.profilePicture;
    ent.locale = c.locale;
    ent.gender = c.gender;
    ent.firstName = c.firstName;
    ent.lastName = c.lastName;
    ent.favorites = c.favorites;
    return ent;
  }
}
