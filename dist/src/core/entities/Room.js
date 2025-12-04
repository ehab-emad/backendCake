"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const Room_model_1 = require("../../infrastructure/database/models/Room.model");
class Room {
    constructor(id, clientId, hotelId, status, roomName, pricePerNight, rating = 0, roomType, room_category = Room_model_1.RoomCategory.Single, max_occupancy = 1, single_bed_count = 0, double_bed_count = 0, available_quantity = 1, availableRooms, numberOfBeds, numberOfGuests, roomSize, view, images = [], amenities = [], floor_type, description, createdAt, updatedAt) {
        this.id = id;
        this.clientId = clientId;
        this.hotelId = hotelId;
        this.status = status;
        this.roomName = roomName;
        this.pricePerNight = pricePerNight;
        this.rating = rating;
        this.roomType = roomType;
        this.room_category = room_category;
        this.max_occupancy = max_occupancy;
        this.single_bed_count = single_bed_count;
        this.double_bed_count = double_bed_count;
        this.available_quantity = available_quantity;
        this.availableRooms = availableRooms;
        this.numberOfBeds = numberOfBeds;
        this.numberOfGuests = numberOfGuests;
        this.roomSize = roomSize;
        this.view = view;
        this.images = images;
        this.amenities = amenities;
        this.floor_type = floor_type;
        this.description = description;
        const now = new Date();
        this.createdAt = createdAt || now;
        this.updatedAt = updatedAt || now;
    }
}
exports.Room = Room;
