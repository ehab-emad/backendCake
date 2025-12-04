import { z } from "zod";
import { coerceNumber, parseStringArray } from "./CreateRoom.dto";
import { RoomCategory } from "../../infrastructure/database/models/Room.model";

// Base schema with all fields made optional for updates
export const UpdateRoomSchema = z.object({
  clientId: z.string().uuid().optional(),
  hotelId: z.string().uuid().optional(),
  status: z.preprocess(
    (val) => val === 'true' || val === true || val === '1',
    z.boolean().optional()
  ),
  roomName: z.string().min(1, { message: "Room name is required" }).optional(),
  pricePerNight: z.preprocess(
    (val) => coerceNumber(val),
    z.number().min(0, { message: "Price must be a positive number" }).optional()
  ),
  rating: z.preprocess(
    (val) => coerceNumber(val),
    z.number().min(0).max(5, { message: "Rating must be between 0 and 5" }).optional()
  ),
  roomType: z.string().min(1, { message: "Room type is required" }).optional(),
  room_category: z.preprocess(
    (val) => {
      if (!val) return undefined;
      return Object.values(RoomCategory).includes(val as RoomCategory) 
        ? val 
        : undefined;
    },
    z.nativeEnum(RoomCategory).optional()
  ),
  max_occupancy: z.preprocess(
    (val) => coerceNumber(val),
    z.number().int().min(1, { message: "Max occupancy must be at least 1" }).optional()
  ),
  single_bed_count: z.preprocess(
    (val) => coerceNumber(val),
    z.number().int().min(0, { message: "Bed count cannot be negative" }).optional()
  ),
  double_bed_count: z.preprocess(
    (val) => coerceNumber(val),
    z.number().int().min(0, { message: "Bed count cannot be negative" }).optional()
  ),
  available_quantity: z.preprocess(
    (val) => coerceNumber(val),
    z.number().int().min(0, { message: "Available quantity cannot be negative" }).optional()
  ),
  availableRooms: z.preprocess(
    (val) => coerceNumber(val),
    z.number().int().min(0, { message: "Available rooms cannot be negative" }).optional()
  ),
  numberOfBeds: z.preprocess(
    (val) => coerceNumber(val),
    z.number().int().min(1, { message: "Number of beds must be at least 1" }).optional()
  ),
  numberOfGuests: z.preprocess(
    (val) => coerceNumber(val),
    z.number().int().min(1, { message: "Number of guests must be at least 1" }).optional()
  ),
  roomSize: z.string().min(1, { message: "Room size is required" }).optional(),
  view: z.string().min(1, { message: "View description is required" }).optional(),
  floor_type: z.string().optional(),
  description: z.string().optional(),
  newImages: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
  imagesToRemove: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(z.string()).optional()
  ),
  amenities: z.preprocess(
    parseStringArray,
    z.array(z.string()).optional()
  ),
  newAmenities: z.preprocess(
    parseStringArray,
    z.array(z.string()).optional()
  ),
}).refine(
  (data) => {
    // Only validate if both fields are present
    if (data.numberOfBeds !== undefined && data.numberOfBeds > 0 && 
        (data.single_bed_count !== undefined || data.double_bed_count !== undefined)) {
      const single = data.single_bed_count || 0;
      const double = data.double_bed_count || 0;
      return (single + double) > 0;
    }
    return true;
  },
  {
    message: "At least one bed (single or double) must be specified when number of beds is greater than 0",
    path: ["single_bed_count"]
  }
);

export type UpdateRoomDTO = z.infer<typeof UpdateRoomSchema>;
