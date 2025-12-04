"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
const CustomerCreatedEvent_1 = require("../events/CustomerCreatedEvent");
class Customer extends AggregateRoot_1.AggregateRoot {
    constructor(id, authUserId, customerType = "Regular", nationality, latitude, longitude, passportNumber, nationalId, nationalIdExpiry, addressLine1, addressLine2, city, customername, email, phoneNumber, country, 
    // Google OAuth fields
    profilePicture, locale, gender, 
    // Name fields for better personalization
    firstName, lastName, 
    // Dates
    registrationDate, expirationDate, dateOfBirth, passportExpiry, 
    // Favorites field
    favorites = []) {
        super();
        this.id = id;
        this.authUserId = authUserId;
        this.customerType = customerType;
        this.nationality = nationality;
        this.latitude = latitude;
        this.longitude = longitude;
        this.passportNumber = passportNumber;
        this.nationalId = nationalId;
        this.nationalIdExpiry = nationalIdExpiry;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.customername = customername;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.country = country;
        this.profilePicture = profilePicture;
        this.locale = locale;
        this.gender = gender;
        this.firstName = firstName;
        this.lastName = lastName;
        this.registrationDate = registrationDate;
        this.expirationDate = expirationDate;
        this.dateOfBirth = dateOfBirth;
        this.passportExpiry = passportExpiry;
        this.favorites = favorites;
    }
    upgradeToVIP() {
        if (this.customerType !== "VIP") {
            this.customerType = "VIP";
        }
    }
    create() {
        this.apply(new CustomerCreatedEvent_1.CustomerCreatedEvent(this.id, this.authUserId));
    }
}
exports.Customer = Customer;
