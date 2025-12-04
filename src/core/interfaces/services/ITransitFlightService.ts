import { TransitFlight } from "../../entities/TransitFlight";

export interface ITransitFlightService {
  listTransitFlights(flightId: string): Promise<TransitFlight[]>;
  addTransitFlight(
    flightId: string,
    transitFlightData: {
      status?: boolean;
      airlineId?: string;
      clientId?: string;
      name?: string;
      rating?: number;
      departureCity: string;
      arrivalCity: string;
      departureIata: string;
      arrivalIata: string;
      departureTime: Date;
      arrivalTime: Date;
      duration: number;
      flightNumber?: string;
      airline?: string;
      price?: number;
      currency?: string;
      numberOfStops?: number;
      availableSeats?: number;
      aircraftType?: string;
      aircraftImage?: string;
      seatLayout?: string;
      seatPitch?: string;
    }
  ): Promise<TransitFlight>;
  removeTransitFlight(flightId: string, transitFlightId: string): Promise<boolean>;
}
