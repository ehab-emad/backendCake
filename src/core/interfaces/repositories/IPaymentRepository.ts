import { Payment } from "../../entities/Payment";
import { FilterPaymentDTO } from "../../../application/dto/FilterPayment.dto";

export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByReservationId(reservationId: string): Promise<Payment[]>;
  findByProcessNumber(processNumber: string): Promise<Payment | null>;
  findAndCount(filters: FilterPaymentDTO): Promise<[Payment[], number]>;
  create(payment: Payment): Promise<void>;
  update(payment: Payment): Promise<void>;
  delete(id: string): Promise<void>;

  sumByStatusBetween(
    statuses: string[],
    start: Date,
    end: Date
  ): Promise<number>;
}
