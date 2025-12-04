"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.CustomerService = void 0;
const uuid_1 = require("uuid");
const inversify_1 = require("inversify");
const Customer_1 = require("../../core/entities/Customer");
const types_1 = require("../../shared/di/types");
const NotFoundException_1 = require("../exceptions/NotFoundException");
let CustomerService = class CustomerService {
    constructor(repo, authRepo) {
        this.repo = repo;
        this.authRepo = authRepo;
    }
    list(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data, total] = yield this.repo.findAndCount(filters);
            return {
                data,
                total,
                page: filters.page,
                limit: filters.limit,
            };
        });
    }
    findByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = yield this.authRepo.findByPhoneNumber(phone);
            if (!auth)
                return null;
            return this.repo.findByAuthUserId(auth.id);
        });
    }
    createCustomer(authUserId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (0, uuid_1.v4)();
            // Helper function to convert null/undefined to undefined for optional fields
            const toOptional = (value) => value === null || value === undefined ? undefined : value;
            // Helper function to safely convert string numbers to numbers
            const toNumber = (value) => {
                if (value === null || value === undefined)
                    return undefined;
                const num = Number(value);
                return isNaN(num) ? undefined : num;
            };
            // Use the name field if available, otherwise combine firstName and lastName
            const name = data.name || [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || undefined;
            // Convert date fields to string if they are Date objects
            const toDateString = (date) => {
                if (!date)
                    return undefined;
                if (typeof date === 'string')
                    return date;
                if (typeof date === 'object' && date !== null && 'toISOString' in date) {
                    return date.toISOString();
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
            const customer = new Customer_1.Customer(authUserId || id, authUserId, data.customerType || 'Regular', toOptional(data.nationality), latitude, longitude, toOptional(data.passportNumber), toOptional(data.nationalId), toOptional(nationalIdExpiry), toOptional(data.addressLine1), toOptional(data.addressLine2), toOptional(data.city), toOptional(name), toOptional(data.email), toOptional(data.phoneNumber), toOptional(data.country), toOptional(data.profilePicture), toOptional(data.locale), toOptional(data.gender), toOptional(data.firstName), toOptional(data.lastName), toOptional(registrationDate), toOptional(expirationDate), toOptional(dateOfBirth));
            customer.create();
            yield this.repo.create(customer);
            return customer;
        });
    }
    updateCustomer(customerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const customer = yield this.repo.findById(customerId);
            if (!customer) {
                throw new NotFoundException_1.NotFoundException("Customer not found");
            }
            // Update basic fields
            customer.customerType = (_a = data.customerType) !== null && _a !== void 0 ? _a : customer.customerType;
            // Update personal information
            if (data.firstName !== undefined)
                customer.firstName = data.firstName;
            if (data.lastName !== undefined)
                customer.lastName = data.lastName;
            if (data.gender !== undefined)
                customer.gender = data.gender;
            if (data.dateOfBirth !== undefined)
                customer.dateOfBirth = data.dateOfBirth;
            // Update identification
            if (data.nationality !== undefined)
                customer.nationality = data.nationality;
            if (data.passportNumber !== undefined)
                customer.passportNumber = data.passportNumber;
            if (data.passportExpiry !== undefined) {
                customer.passportExpiry = data.passportExpiry &&
                    typeof data.passportExpiry === 'object' &&
                    'toISOString' in data.passportExpiry
                    ? data.passportExpiry.toISOString()
                    : data.passportExpiry;
            }
            if (data.nationalId !== undefined)
                customer.nationalId = data.nationalId;
            if (data.nationalIdExpiry !== undefined) {
                customer.nationalIdExpiry = data.nationalIdExpiry &&
                    typeof data.nationalIdExpiry === 'object' &&
                    'toISOString' in data.nationalIdExpiry
                    ? data.nationalIdExpiry.toISOString()
                    : data.nationalIdExpiry;
            }
            // Update address
            if (data.addressLine1 !== undefined)
                customer.addressLine1 = data.addressLine1;
            if (data.addressLine2 !== undefined)
                customer.addressLine2 = data.addressLine2;
            if (data.city !== undefined)
                customer.city = data.city;
            if (data.country !== undefined)
                customer.country = data.country;
            // Update contact information
            if (data.phoneNumber !== undefined)
                customer.phoneNumber = data.phoneNumber;
            if (data.email !== undefined)
                customer.email = data.email;
            // Update location
            if (data.latitude !== undefined)
                customer.latitude = data.latitude;
            if (data.longitude !== undefined)
                customer.longitude = data.longitude;
            // Update authentication & preferences
            if (data.profilePicture !== undefined)
                customer.profilePicture = data.profilePicture;
            if (data.locale !== undefined)
                customer.locale = data.locale;
            // Update name (handle both name and firstName/lastName)
            if (data.name !== undefined) {
                customer.customername = data.name;
            }
            else if (data.firstName !== undefined || data.lastName !== undefined) {
                const firstName = (_c = (_b = data.firstName) !== null && _b !== void 0 ? _b : customer.firstName) !== null && _c !== void 0 ? _c : '';
                const lastName = (_e = (_d = data.lastName) !== null && _d !== void 0 ? _d : customer.lastName) !== null && _e !== void 0 ? _e : '';
                customer.customername = [firstName, lastName].filter(Boolean).join(' ').trim() || undefined;
            }
            customer.registrationDate =
                (_f = data.registrationDate) !== null && _f !== void 0 ? _f : customer.registrationDate;
            customer.expirationDate = (_g = data.expirationDate) !== null && _g !== void 0 ? _g : customer.expirationDate;
            yield this.repo.update(customer);
            return customer;
        });
    }
    deleteCustomer(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield this.repo.findById(customerId);
            if (!customer) {
                throw new NotFoundException_1.NotFoundException("Customer not found");
            }
            yield this.repo.delete(customerId);
            yield this.authRepo.delete(customer.authUserId);
        });
    }
    upgradeToVIP(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield this.repo.findById(customerId);
            if (!customer) {
                throw new NotFoundException_1.NotFoundException("Customer not found");
            }
            customer.upgradeToVIP();
            yield this.repo.update(customer);
            return customer;
        });
    }
    findById(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const c = yield this.repo.findById(customerId);
            if (!c) {
                throw new NotFoundException_1.NotFoundException("Customer not found");
            }
            return c;
        });
    }
    findByAuthUserId(authUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const u = yield this.authRepo.findById(authUserId);
            if (!u) {
                throw new NotFoundException_1.NotFoundException("AuthUser not found");
            }
            const c = yield this.repo.findByAuthUserId(authUserId);
            if (!c) {
                throw new NotFoundException_1.NotFoundException("Customer not found for that user");
            }
            return c;
        });
    }
    // دوال المفضلة (Favorites)
    addToFavorites(customerId, itemType, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield this.repo.findById(customerId);
            if (!customer) {
                throw new NotFoundException_1.NotFoundException("Customer not found");
            }
            // تحقق إذا كان العنصر موجود بالفعل في المفضلة
            const existingIndex = customer.favorites.findIndex(item => item.type === itemType && item.id === itemId);
            if (existingIndex >= 0) {
                // العنصر موجود بالفعل، لا نحتاج لفعل شيء
                return customer;
            }
            // إضافة العنصر الجديد للمفضلة
            customer.favorites = [
                ...customer.favorites,
                { type: itemType, id: itemId }
            ];
            yield this.repo.update(customer);
            return customer;
        });
    }
    removeFromFavorites(customerId, itemType, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield this.repo.findById(customerId);
            if (!customer) {
                throw new NotFoundException_1.NotFoundException("Customer not found");
            }
            // إزالة العنصر من المفضلة
            customer.favorites = customer.favorites.filter(item => !(item.type === itemType && item.id === itemId));
            yield this.repo.update(customer);
            return customer;
        });
    }
    getFavorites(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield this.repo.findById(customerId);
            if (!customer) {
                throw new NotFoundException_1.NotFoundException("Customer not found");
            }
            return customer.favorites;
        });
    }
    isFavorite(customerId, itemType, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield this.repo.findById(customerId);
            if (!customer) {
                throw new NotFoundException_1.NotFoundException("Customer not found");
            }
            return customer.favorites.some(item => item.type === itemType && item.id === itemId);
        });
    }
    clearFavorites(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield this.repo.findById(customerId);
            if (!customer) {
                throw new NotFoundException_1.NotFoundException("Customer not found");
            }
            customer.favorites = [];
            yield this.repo.update(customer);
            return customer;
        });
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.CustomerRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.AuthRepository)),
    __metadata("design:paramtypes", [Object, Object])
], CustomerService);
