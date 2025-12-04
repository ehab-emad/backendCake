import { Reservation } from "../../entities/Reservation";
import { FilterReservationDTO } from "../../../application/dto/FilterReservation.dto";

export interface IReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  findAllByClient(clientId: string): Promise<Reservation[]>;
  findAndCount(filters: FilterReservationDTO): Promise<[Reservation[], number]>;
  create(r: Reservation): Promise<void>;
  update(r: Reservation): Promise<void>;
  delete(id: string): Promise<void>;

  countByStatusesBetween(
    statuses: string[],
    start: Date,
    end: Date
  ): Promise<number>;
}
