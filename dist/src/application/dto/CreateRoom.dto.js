"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomSchema = exports.coerceNumber = exports.parseStringArray = void 0;
const zod_1 = require("zod");
const Room_model_1 = require("../../infrastructure/database/models/Room.model");
// Helper function to parse stringified arrays from form data
const parseStringArray = (value) => {
    if (Array.isArray(value))
        return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [parsed];
        }
        catch (e) {
            return value ? [value] : [];
        }
    }
    return [];
};
exports.parseStringArray = parseStringArray;
// Helper function to coerce string to number with fallback
const coerceNumber = (val, fallback = 0) => {
    if (val === undefined || val === null)
        return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
};
exports.coerceNumber = coerceNumber;
exports.CreateRoomSchema = zod_1.z.object({
    clientId: zod_1.z.string().uuid(),
    hotelId: zod_1.z.string().uuid(),
    status: zod_1.z.preprocess((val) => val === 'true' || val === true || val === '1', zod_1.z.boolean().default(false)),
    roomName: zod_1.z.string().min(1, { message: "Room name is required" }),
    pricePerNight: zod_1.z.preprocess((val) => (0, exports.coerceNumber)(val, 0), zod_1.z.number().min(0, { message: "Price must be a positive number" })),
    rating: zod_1.z.preprocess((val) => (0, exports.coerceNumber)(val, 0), zod_1.z.number().min(0).max(5, { message: "Rating must be between 0 and 5" }).default(0)),
    roomType: zod_1.z.string().min(1, { message: "Room type is required" }),
    room_category: zod_1.z.preprocess((val) => {
        if (!val)
            return Room_model_1.RoomCategory.Single;
        return Object.values(Room_model_1.RoomCategory).includes(val)
            ? val
            : Room_model_1.RoomCategory.Single;
    }, zod_1.z.nativeEnum(Room_model_1.RoomCategory).default(Room_model_1.RoomCategory.Single)),
    max_occupancy: zod_1.z.preprocess((val) => (0, exports.coerceNumber)(val, 1), zod_1.z.number().int().min(1, { message: "Max occupancy must be at least 1" })),
    single_bed_count: zod_1.z.preprocess((val) => (0, exports.coerceNumber)(val, 0), zod_1.z.number().int().min(0, { message: "Bed count cannot be negative" })),
    double_bed_count: zod_1.z.preprocess((val) => (0, exports.coerceNumber)(val, 0), zod_1.z.number().int().min(0, { message: "Bed count cannot be negative" })),
    available_quantity: zod_1.z.preprocess((val) => (0, exports.coerceNumber)(val, 1), zod_1.z.number().int().min(0, { message: "Available quantity cannot be negative" })),
    availableRooms: zod_1.z.preprocess((val) => (0, exports.coerceNumber)(val, 0), zod_1.z.number().int().min(0, { message: "Available rooms cannot be negative" })),
    numberOfBeds: zod_1.z.preprocess((val) => (0, exports.coerceNumber)(val, 1), zod_1.z.number().int().min(1, { message: "Number of beds must be at least 1" })),
    numberOfGuests: zod_1.z.preprocess((val) => (0, exports.coerceNumber)(val, 1), zod_1.z.number().int().min(1, { message: "Number of guests must be at least 1" })),
    roomSize: zod_1.z.string().min(1, { message: "Room size is required" }),
    view: zod_1.z.string().min(1, { message: "View description is required" }),
    floor_type: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    images: zod_1.z.preprocess(exports.parseStringArray, zod_1.z.array(zod_1.z.string()).optional()),
    amenities: zod_1.z.preprocess(exports.parseStringArray, zod_1.z.array(zod_1.z.string()).optional()),
}).refine((data) => {
    // Ensure at least one bed is specified if number of beds is greater than 0
    if (data.numberOfBeds > 0) {
        return (data.single_bed_count + data.double_bed_count) > 0;
    }
    return true;
}, {
    message: "At least one bed (single or double) must be specified when number of beds is greater than 0",
    path: ["single_bed_count"]
});
