"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hotel = void 0;
const AggregateRoot_1 = require("./AggregateRoot");
const HotelImage_1 = require("./HotelImage");
const HotelAmenity_1 = require("./HotelAmenity");
class Hotel extends AggregateRoot_1.AggregateRoot {
    constructor(id, clientId, status, rating = 0, price = 0, name, branchName, contactNumber, contactPerson, country, city, address, description, commissionRate, 
    // public contractDuration?: number,
    contractStartDate, contractEndDate, generalAmenities, diningAmenities, wellnessAmenities, businessAmenities, otherAmenities, map, 
    // Geo
    latitude, longitude, imageUrls, meals, unlimitedInternet, airportTransfer, createdAt, updatedAt) {
        super();
        this.id = id;
        this.clientId = clientId;
        this.status = status;
        this.rating = rating;
        this.price = price;
        this.name = name;
        this.branchName = branchName;
        this.contactNumber = contactNumber;
        this.contactPerson = contactPerson;
        this.country = country;
        this.city = city;
        this.address = address;
        this.description = description;
        this.commissionRate = commissionRate;
        this.contractStartDate = contractStartDate;
        this.contractEndDate = contractEndDate;
        this.generalAmenities = generalAmenities;
        this.diningAmenities = diningAmenities;
        this.wellnessAmenities = wellnessAmenities;
        this.businessAmenities = businessAmenities;
        this.otherAmenities = otherAmenities;
        this.map = map;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageUrls = imageUrls;
        this.meals = meals;
        this.unlimitedInternet = unlimitedInternet;
        this.airportTransfer = airportTransfer;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.images = [];
        this.amenities = [];
        this.ratings = [];
    }
    addImage(img) {
        this.images.push(img);
        img.markAdded();
        this.applyEventsFrom(img);
    }
    removeImage(imageId) {
        this.images = this.images.filter((i) => i.id !== imageId);
        const marker = new HotelImage_1.HotelImage(imageId, this.id, "");
        marker.markRemoved();
        this.applyEventsFrom(marker);
    }
    addAmenity(a) {
        this.amenities.push(a);
        a.markAdded();
        this.applyEventsFrom(a);
    }
    removeAmenity(amenityId) {
        this.amenities = this.amenities.filter((a) => a.id !== amenityId);
        const marker = new HotelAmenity_1.HotelAmenity(amenityId, this.id, "");
        marker.markRemoved();
        this.applyEventsFrom(marker);
    }
    applyEventsFrom(ar) {
        for (const e of ar.pullEvents()) {
            this.apply(e);
        }
    }
}
exports.Hotel = Hotel;
