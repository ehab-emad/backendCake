"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirLine = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
const AirLineImage_1 = require("./AirLineImage");
const AirLineFeature_1 = require("./AirLineFeature");
const AirLineMeal_1 = require("./AirLineMeal");
const AirLine_model_1 = require("../../infrastructure/database/models/AirLine.model");
class AirLine extends AggregateRoot_1.AggregateRoot {
    // Add a method to expose images for serialization
    getImages() {
        return this.images.map(img => ({
            id: img.id,
            airLineId: img.airLineId,
            path: img.path
        }));
    }
    constructor(id, clientId, companyName, rating = 0, phoneNumber, email, iataCode, country, city, flightType, mealsAvailable, specialOffers, collaborationStartDate, contractDuration, commissionRate, status, airline_name, airline_type = AirLine_model_1.AirlineType.International, isCharter = false, contractStartDate, contractEndDate, additionalServices, specialAmenities, logoUrl, promotionalImages = [], documents = [], createdAt, updatedAt) {
        super();
        // Make sure these arrays are properly exposed for serialization
        this.images = [];
        this.features = [];
        this.meals = [];
        this.id = id;
        this.clientId = clientId;
        this.companyName = companyName;
        this.rating = rating;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.iataCode = iataCode;
        this.country = country;
        this.city = city;
        this.flightType = flightType;
        this.mealsAvailable = mealsAvailable;
        this.specialOffers = specialOffers;
        this.collaborationStartDate = collaborationStartDate;
        this.contractDuration = contractDuration;
        this.commissionRate = commissionRate;
        this.status = status;
        this.airline_name = airline_name;
        this.airline_type = airline_type;
        this.isCharter = isCharter;
        this.contractStartDate = contractStartDate;
        this.contractEndDate = contractEndDate;
        this.additionalServices = additionalServices;
        this.specialAmenities = specialAmenities;
        this.logoUrl = logoUrl;
        // Ensure promotionalImages is always an array of strings
        this.promotionalImages = Array.isArray(promotionalImages)
            ? promotionalImages.filter((item) => typeof item === 'string')
            : [];
        // Ensure documents is always an array of strings
        this.documents = Array.isArray(documents)
            ? documents.filter((item) => typeof item === 'string')
            : [];
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }
    addImage(img) {
        this.images.push(img);
        img.markAdded();
        this.applyEventsFrom(img);
    }
    removeImage(imageId) {
        this.images = this.images.filter((i) => i.id !== imageId);
        const marker = new AirLineImage_1.AirLineImage(imageId, this.id, "");
        marker.markRemoved();
        this.applyEventsFrom(marker);
    }
    addFeature(f) {
        this.features.push(f);
        f.markAdded();
        this.applyEventsFrom(f);
    }
    removeFeature(featureId) {
        this.features = this.features.filter((f) => f.id !== featureId);
        const marker = new AirLineFeature_1.AirLineFeature(featureId, this.id, "");
        marker.markRemoved();
        this.applyEventsFrom(marker);
    }
    addMeal(m) {
        this.meals.push(m);
        m.markAdded();
        this.applyEventsFrom(m);
    }
    removeMeal(mealId) {
        this.meals = this.meals.filter((m) => m.id !== mealId);
        const marker = new AirLineMeal_1.AirLineMeal(mealId, this.id, "");
        marker.markRemoved();
        this.applyEventsFrom(marker);
    }
    applyEventsFrom(ar) {
        for (const e of ar.pullEvents()) {
            this.apply(e);
        }
    }
}
exports.AirLine = AirLine;
