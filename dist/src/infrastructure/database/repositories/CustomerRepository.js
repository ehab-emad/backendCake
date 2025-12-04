"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const inversify_1 = require("inversify");
const database_config_1 = require("../../config/database.config");
const Customer_model_1 = require("../models/Customer.model");
const Customer_1 = require("../../../core/entities/Customer");
let CustomerRepository = class CustomerRepository {
    get repo() {
        if (!database_config_1.AppDataSource.isInitialized) {
            throw new Error("Data source is not initialized");
        }
        return database_config_1.AppDataSource.getRepository(Customer_model_1.CustomerEntity);
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo
                .createQueryBuilder("c")
                .innerJoinAndSelect("c.authUser", "u")
                .where("c.id = :id", { id })
                .getOne();
            return ent ? this.toDomain(ent) : null;
        });
    }
    findByAuthUserId(authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ent = yield this.repo
                .createQueryBuilder("c")
                .innerJoinAndSelect("c.authUser", "u")
                .where("c.auth_user_id = :authUserId", { authUserId })
                .getOne();
            return ent ? this.toDomain(ent) : null;
        });
    }
    create(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.save(this.toEntity(customer));
        });
    }
    update(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.update(customer.id, this.toEntity(customer));
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repo.delete(id);
        });
    }
    findAndCount(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, page = 1, limit = 20 } = filters;
            const qb = this.repo
                .createQueryBuilder("c")
                .innerJoinAndSelect("c.authUser", "u");
            if (search) {
                const like = `%${search}%`;
                qb.andWhere("(u.first_name ILIKE :like OR u.last_name ILIKE :like OR c.phone_number ILIKE :like)", { like });
            }
            const total = yield qb.getCount();
            const dataEnts = yield qb
                .orderBy("c.createdAt", "DESC")
                .skip((Number(page) - 1) * Number(limit))
                .take(Number(limit))
                .getMany();
            return [dataEnts.map((e) => this.toDomain(e)), total];
        });
    }
    toDomain(ent) {
        const customer = new Customer_1.Customer(ent.id, ent.authUserId, ent.customerType, ent.nationality, ent.latitude, ent.longitude, ent.passportNumber, ent.nationalId, ent.nationalIdExpiry, ent.addressLine1, ent.addressLine2, ent.city, ent.customername, ent.email, ent.phoneNumber, ent.country, 
        // Google OAuth fields
        ent.profilePicture, ent.locale, ent.gender, ent.firstName, ent.lastName, ent.registrationDate, ent.expirationDate, ent.dateOfBirth, ent.passportExpiry, (ent.favorites || []));
        return customer;
    }
    toEntity(c) {
        const ent = new Customer_model_1.CustomerEntity();
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
};
exports.CustomerRepository = CustomerRepository;
exports.CustomerRepository = CustomerRepository = __decorate([
    (0, inversify_1.injectable)()
], CustomerRepository);
