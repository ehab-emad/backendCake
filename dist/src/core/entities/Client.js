"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
class Client {
    constructor(id, name, email, rating = 0, address, phone, profileImage, attachments = [], licenseNumber, city, websiteUrl, additionalPhoneNumber, subscriptionType, approved = false, active = true, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.rating = rating;
        this.address = address;
        this.phone = phone;
        this.profileImage = profileImage;
        this.attachments = attachments;
        this.licenseNumber = licenseNumber;
        this.city = city;
        this.websiteUrl = websiteUrl;
        this.additionalPhoneNumber = additionalPhoneNumber;
        this.subscriptionType = subscriptionType;
        this.approved = approved;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Client = Client;
