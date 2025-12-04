import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { PaymentEntity } from "../models/Payment.model";
import { IPaymentRepository } from "../../../core/interfaces/repositories/IPaymentRepository";
import { Payment } from "../../../core/entities/Payment";
import { FilterPaymentDTO } from "../../../application/dto/FilterPayment.dto";

@injectable()
export class PaymentRepository implements IPaymentRepository {
  private get repo(): Repository<PaymentEntity> {
    if (!AppDataSource.isInitialized) {
      throw new Error("DataSource not initialized");
    }
    return AppDataSource.getRepository(PaymentEntity);
  }

  async findById(id: string): Promise<Payment | null> {
    const e = await this.repo.findOneBy({ id });
    if (!e) return null;
    return new Payment(
      e.id,
      e.process_number,
      e.reservation_id,
      e.customer_id,
      e.client_id,
      e.category,
      e.transaction_status,
      Number(e.amount),
      e.created_at
    );
  }

  async findByReservationId(reservationId: string): Promise<Payment[]> {
    const entities = await this.repo.find({
      where: { reservation_id: reservationId },
      order: { created_at: 'DESC' }
    });
    
    return entities.map(e => new Payment(
      e.id,
      e.process_number,
      e.reservation_id,
      e.customer_id,
      e.client_id,
      e.category,
      e.transaction_status,
      Number(e.amount),
      e.created_at
    ));
  }

  async findByProcessNumber(processNumber: string): Promise<Payment | null> {
    const e = await this.repo.findOneBy({ process_number: processNumber });
    if (!e) return null;
    return new Payment(
      e.id,
      e.process_number,
      e.reservation_id,
      e.customer_id,
      e.client_id,
      e.category,
      e.transaction_status,
      Number(e.amount),
      e.created_at
    );
  }

  async findAndCount(filters: FilterPaymentDTO): Promise<[Payment[], number]> {
    let qb = this.repo.createQueryBuilder("p");

    if (filters.clientId) {
      qb = qb.where("p.client_id = :clientId", {
        clientId: filters.clientId,
      });
    }

    if (filters.reservationId) {
      qb = qb.andWhere("p.reservation_id = :reservationId", {
        reservationId: filters.reservationId,
      });
    }

    if (filters.status) {
      qb = qb.andWhere("p.transaction_status = :status", {
        status: filters.status,
      });
    }
    if (filters.minAmount !== undefined) {
      qb = qb.andWhere("p.amount >= :min", { min: filters.minAmount });
    }
    if (filters.maxAmount !== undefined) {
      qb = qb.andWhere("p.amount <= :max", { max: filters.maxAmount });
    }
    if (filters.fromDate) {
      qb = qb.andWhere("p.created_at >= :from", {
        from: filters.fromDate,
      });
    }
    if (filters.toDate) {
      qb = qb.andWhere("p.created_at <= :to", {
        to: filters.toDate,
      });
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    qb = qb
      .orderBy("p.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    const payments = entities.map(
      (e) =>
        new Payment(
          e.id,
          e.process_number,
          e.reservation_id,
          e.customer_id,
          e.client_id,
          e.category,
          e.transaction_status,
          Number(e.amount),
          e.created_at
        )
    );
    return [payments, total];
  }

  async sumByStatusBetween(
    statuses: string[],
    start: Date,
    end: Date
  ): Promise<number> {
    const row = await this.repo
      .createQueryBuilder("p")
      .select("SUM(p.amount)", "total")
      .where("p.transaction_status IN (:...statuses)", { statuses })
      .andWhere("p.created_at BETWEEN :start AND :end", { start, end })
      .getRawOne<{ total: string }>();

    const totalStr = row?.total ?? "0";
    return parseFloat(totalStr);
  }

  async create(p: Payment): Promise<void> {
    await this.repo.insert({
      id: p.id,
      process_number: p.processNumber,
      reservation_id: p.reservationId,
      customer_id: p.customerId,
      client_id: p.clientId,
      category: p.category,
      transaction_status: p.transactionStatus,
      amount: p.amount.toString(),
    });
  }

  async update(p: Payment): Promise<void> {
    await this.repo.update(p.id, {
      reservation_id: p.reservationId,
      customer_id: p.customerId,
      client_id: p.clientId,
      category: p.category,
      transaction_status: p.transactionStatus,
      amount: p.amount.toString(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
