import { CreateReservationDTO } from "../../../application/dto/CreateReservation.dto";
import { UpdateReservationDTO } from "../../../application/dto/UpdateReservation.dto";
import { FilterReservationDTO } from "../../../application/dto/FilterReservation.dto";
import { Reservation } from "../../entities/Reservation";
import { Payment } from "../../entities/Payment";
import { PaymentGateway } from "../../types/payment.types";

export interface IReservationService {
  create(dto: CreateReservationDTO, paymentMethod: PaymentGateway): Promise<{reservation: Reservation, paymentUrl: string}>;
  createReservationOnly(dto: CreateReservationDTO): Promise<Reservation>;
  listReservations(filters: FilterReservationDTO): Promise<{data: any[], total: number, page: number, limit: number}>;
  get(id: string): Promise<Reservation & { payment?: Payment }>;
  update(id: string, dto: UpdateReservationDTO): Promise<Reservation>;
  delete(id: string): Promise<void>;
  confirmPayment(paymentId: string): Promise<Reservation>;
  cancel(id: string): Promise<Reservation>;
}
