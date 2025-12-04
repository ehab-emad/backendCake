import { v4 as uuid } from "uuid";
import { inject, injectable } from "inversify";
import { ICustomerRepository } from "../../core/interfaces/repositories/ICustomerRepository";
import { IAuthRepository } from "../../core/interfaces/repositories/IAuthRepository";
import { Customer } from "../../core/entities/Customer";
import { FilterCustomerDTO } from "../dto/FilterCustomer.dto";
import { CreateCustomerDTO } from "../dto/CreateCustomer.dto";
import { UpdateCustomerDTO } from "../dto/UpdateCustomer.dto";
import { TYPES } from "../../shared/di/types";
import { NotFoundException } from "../exceptions/NotFoundException";

@injectable()
export class CustomerService {
  constructor(
    @inject(TYPES.CustomerRepository)
    private readonly repo: ICustomerRepository,
    @inject(TYPES.AuthRepository)
    private readonly authRepo: IAuthRepository
  ) {}

  public async list(filters: FilterCustomerDTO): Promise<{
    data: Customer[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.repo.findAndCount(filters);
    return {
      data,
      total,
      page: filters.page,
      limit: filters.limit,
    };
  }

  public async findByPhone(phone: string): Promise<Customer | null> {
    const auth = await this.authRepo.findByPhoneNumber(phone);
    if (!auth) return null;
    return this.repo.findByAuthUserId(auth.id);
  }

  public async createCustomer(
    authUserId: string,
    data: CreateCustomerDTO
  ): Promise<Customer> {
    const id = uuid();
    // Helper function to convert null/undefined to undefined for optional fields
    const toOptional = <T>(value: T | null | undefined): T | undefined => 
      value === null || value === undefined ? undefined : value;

    // Helper function to safely convert string numbers to numbers
    const toNumber = (value: any): number | undefined => {
      if (value === null || value === undefined) return undefined;
      const num = Number(value);
      return isNaN(num) ? undefined : num;
    };

    // Use the name field if available, otherwise combine firstName and lastName
    const name = data.name || [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || undefined;
    
    // Convert date fields to string if they are Date objects
    const toDateString = (date: unknown): string | undefined => {
      if (!date) return undefined;
      if (typeof date === 'string') return date;
      if (typeof date === 'object' && date !== null && 'toISOString' in date) {
        return (date as Date).toISOString();
      }
      return undefined;
    };
    
    const registrationDate = toDateString(data.registrationDate);
    const expirationDate = toDateString(data.expirationDate);
    const dateOfBirth = toDateString(data.dateOfBirth);
    const passportExpiry = toDateString(data.passportExpiry);
    const nationalIdExpiry = toDateString(data.nationalIdExpiry);
    
    // Ensure latitude and longitude are numbers
    const latitude = toNumber(data.latitude);
    const longitude = toNumber(data.longitude);

    const customer = new Customer(
      authUserId || id,
      authUserId,
      data.customerType || 'Regular',
      toOptional(data.nationality),
      latitude,
      longitude,
      toOptional(data.passportNumber),
      toOptional(data.nationalId),
      toOptional(nationalIdExpiry),
      toOptional(data.addressLine1),
      toOptional(data.addressLine2),
      toOptional(data.city),
      toOptional(name),
      toOptional(data.email),
      toOptional(data.phoneNumber),
      toOptional(data.country),
      toOptional(data.profilePicture),
      toOptional(data.locale),
      toOptional(data.gender),
      toOptional(data.firstName),
      toOptional(data.lastName),
      toOptional(registrationDate),
    
      toOptional(expirationDate),
      toOptional(dateOfBirth)
    );

    customer.create();
    await this.repo.create(customer);
    return customer;
  }

  public async updateCustomer(
    customerId: string,
    data: UpdateCustomerDTO
  ): Promise<Customer> {
    const customer = await this.repo.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    // Update basic fields
    customer.customerType = data.customerType ?? customer.customerType;
    
    // Update personal information
    if (data.firstName !== undefined) customer.firstName = data.firstName;
    if (data.lastName !== undefined) customer.lastName = data.lastName;
    if (data.gender !== undefined) customer.gender = data.gender;
    if (data.dateOfBirth !== undefined) customer.dateOfBirth = data.dateOfBirth;
    
    // Update identification
    if (data.nationality !== undefined) customer.nationality = data.nationality;
    if (data.passportNumber !== undefined) customer.passportNumber = data.passportNumber;
    if (data.passportExpiry !== undefined) {
      customer.passportExpiry = data.passportExpiry && 
        typeof data.passportExpiry === 'object' && 
        'toISOString' in data.passportExpiry
          ? (data.passportExpiry as Date).toISOString()
          : data.passportExpiry as string | undefined;
    }
    if (data.nationalId !== undefined) customer.nationalId = data.nationalId;
    if (data.nationalIdExpiry !== undefined) {
      customer.nationalIdExpiry = data.nationalIdExpiry &&
        typeof data.nationalIdExpiry === 'object' &&
        'toISOString' in data.nationalIdExpiry
          ? (data.nationalIdExpiry as Date).toISOString()
          : data.nationalIdExpiry as string | undefined;
    }
    
    // Update address
    if (data.addressLine1 !== undefined) customer.addressLine1 = data.addressLine1;
    if (data.addressLine2 !== undefined) customer.addressLine2 = data.addressLine2;
    if (data.city !== undefined) customer.city = data.city;
    if (data.country !== undefined) customer.country = data.country;
    
    // Update contact information
    if (data.phoneNumber !== undefined) customer.phoneNumber = data.phoneNumber;
    if (data.email !== undefined) customer.email = data.email;
    
    // Update location
    if (data.latitude !== undefined) customer.latitude = data.latitude;
    if (data.longitude !== undefined) customer.longitude = data.longitude;
    
    // Update authentication & preferences
    if (data.profilePicture !== undefined) customer.profilePicture = data.profilePicture;
    if (data.locale !== undefined) customer.locale = data.locale;
    
    // Update name (handle both name and firstName/lastName)
    if (data.name !== undefined) {
      customer.customername = data.name;
    } else if (data.firstName !== undefined || data.lastName !== undefined) {
      const firstName = data.firstName ?? customer.firstName ?? '';
      const lastName = data.lastName ?? customer.lastName ?? '';
      customer.customername = [firstName, lastName].filter(Boolean).join(' ').trim() || undefined;
    }
    customer.registrationDate =
      data.registrationDate ?? customer.registrationDate;
    customer.expirationDate = data.expirationDate ?? customer.expirationDate;

    await this.repo.update(customer);
    return customer;
  }

  public async deleteCustomer(customerId: string): Promise<void> {
    const customer = await this.repo.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    await this.repo.delete(customerId);

    await this.authRepo.delete(customer.authUserId);
  }

  public async upgradeToVIP(customerId: string): Promise<Customer> {
    const customer = await this.repo.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }
    customer.upgradeToVIP();
    await this.repo.update(customer);
    return customer;
  }

  public async findById(customerId: string): Promise<Customer> {
    const c = await this.repo.findById(customerId);
    if (!c) {
      throw new NotFoundException("Customer not found");
    }
    return c;
  }

  public async findByAuthUserId(authUserId: string): Promise<Customer> {
    const u = await this.authRepo.findById(authUserId);
    if (!u) {
      throw new NotFoundException("AuthUser not found");
    }
    const c = await this.repo.findByAuthUserId(authUserId);
    if (!c) {
      throw new NotFoundException("Customer not found for that user");
    }
    return c;
  }

  // دوال المفضلة (Favorites)
  public async addToFavorites(
    customerId: string,
    itemType: 'flight' | 'hotel' | 'package' | 'trip',
    itemId: string
  ): Promise<Customer> {
    const customer = await this.repo.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    // تحقق إذا كان العنصر موجود بالفعل في المفضلة
    const existingIndex = customer.favorites.findIndex(
      item => item.type === itemType && item.id === itemId
    );

    if (existingIndex >= 0) {
      // العنصر موجود بالفعل، لا نحتاج لفعل شيء
      return customer;
    }

    // إضافة العنصر الجديد للمفضلة
    customer.favorites = [
      ...customer.favorites,
      { type: itemType, id: itemId }
    ];

    await this.repo.update(customer);
    return customer;
  }

  public async removeFromFavorites(
    customerId: string,
    itemType: 'flight' | 'hotel' | 'package' | 'trip',
    itemId: string
  ): Promise<Customer> {
    const customer = await this.repo.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    // إزالة العنصر من المفضلة
    customer.favorites = customer.favorites.filter(
      item => !(item.type === itemType && item.id === itemId)
    );

    await this.repo.update(customer);
    return customer;
  }

  public async getFavorites(customerId: string): Promise<Customer['favorites']> {
    const customer = await this.repo.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return customer.favorites;
  }

  public async isFavorite(
    customerId: string,
    itemType: 'flight' | 'hotel' | 'package' | 'trip',
    itemId: string
  ): Promise<boolean> {
    const customer = await this.repo.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    return customer.favorites.some(
      item => item.type === itemType && item.id === itemId
    );
  }

  public async clearFavorites(customerId: string): Promise<Customer> {
    const customer = await this.repo.findById(customerId);
    if (!customer) {
      throw new NotFoundException("Customer not found");
    }

    customer.favorites = [];
    await this.repo.update(customer);
    return customer;
  }
}
