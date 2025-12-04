import { z } from "zod";
import { RoomCategory } from "../../infrastructure/database/models/Room.model";

// Helper function to parse stringified arrays from form data
export const parseStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      return value ? [value] : [];
    }
  }
  return [];
};

// Helper function to coerce string to number with fallback
export const coerceNumber = (val: unknown, fallback = 0): number => {
  if (val === undefined || val === null) return fallback;
  const num = Number(val);
  return isNaN(num) ? fallback : num;
};

export const CreateRoomSchema = z.object({
  clientId: z.string().uuid(),
  hotelId: z.string().uuid(),
  status: z.preprocess(
    (val) => val === 'true' || val === true || val === '1',
    z.boolean().default(false)
  ),
  roomName: z.string().min(1, { message: "Room name is required" }),
  pricePerNight: z.preprocess(
    (val) => coerceNumber(val, 0),
    z.number().min(0, { message: "Price must be a positive number" })
  ),
  rating: z.preprocess(
    (val) => coerceNumber(val, 0),
    z.number().min(0).max(5, { message: "Rating must be between 0 and 5" }).default(0)
  ),
  roomType: z.string().min(1, { message: "Room type is required" }),
  room_category: z.preprocess(
    (val) => {
      if (!val) return RoomCategory.Single;
      return Object.values(RoomCategory).includes(val as RoomCategory) 
        ? val 
        : RoomCategory.Single;
    },
    z.nativeEnum(RoomCategory).default(RoomCategory.Single)
  ),
  max_occupancy: z.preprocess(
    (val) => coerceNumber(val, 1),
    z.number().int().min(1, { message: "Max occupancy must be at least 1" })
  ),
  single_bed_count: z.preprocess(
    (val) => coerceNumber(val, 0),
    z.number().int().min(0, { message: "Bed count cannot be negative" })
  ),
  double_bed_count: z.preprocess(
    (val) => coerceNumber(val, 0),
    z.number().int().min(0, { message: "Bed count cannot be negative" })
  ),
  available_quantity: z.preprocess(
    (val) => coerceNumber(val, 1),
    z.number().int().min(0, { message: "Available quantity cannot be negative" })
  ),
  availableRooms: z.preprocess(
    (val) => coerceNumber(val, 0),
    z.number().int().min(0, { message: "Available rooms cannot be negative" })
  ),
  numberOfBeds: z.preprocess(
    (val) => coerceNumber(val, 1),
    z.number().int().min(1, { message: "Number of beds must be at least 1" })
  ),
  numberOfGuests: z.preprocess(
    (val) => coerceNumber(val, 1),
    z.number().int().min(1, { message: "Number of guests must be at least 1" })
  ),
  roomSize: z.string().min(1, { message: "Room size is required" }),
  view: z.string().min(1, { message: "View description is required" }),
  floor_type: z.string().optional(),
  description: z.string().optional(),
  images: z.preprocess(
    parseStringArray,
    z.array(z.string()).optional()
  ),
  amenities: z.preprocess(
    parseStringArray,
    z.array(z.string()).optional()
  ),
}).refine(
  (data) => {
    // Ensure at least one bed is specified if number of beds is greater than 0
    if (data.numberOfBeds > 0) {
      return (data.single_bed_count + data.double_bed_count) > 0;
    }
    return true;
  },
  {
    message: "At least one bed (single or double) must be specified when number of beds is greater than 0",
    path: ["single_bed_count"]
  }
);

export type CreateRoomDTO = z.infer<typeof CreateRoomSchema>;
