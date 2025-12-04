import { injectable } from "inversify";
import { Repository } from "typeorm";
import { AppDataSource } from "../../config/database.config";
import { ReservationEntity } from "../models/Reservation.model";
import { CustomerEntity } from "../models/Customer.model";
import { IReservationRepository } from "../../../core/interfaces/repositories/IReservationRepository";
import { Reservation, ReservationStatus } from "../../../core/entities/Reservation";
import { FilterReservationDTO } from "../../../application/dto/FilterReservation.dto";
import { PaymentStatus } from "../../../core/types/payment.types";

@injectable()
export class ReservationRepository implements IReservationRepository {
  private get repo(): Repository<ReservationEntity> {
    if (!AppDataSource.isInitialized) throw new Error("DS not inited");
    return AppDataSource.getRepository(ReservationEntity);
  }

  private isReservationStatus(status: string): status is ReservationStatus {
    const validStatuses = [
      'pending' as const, 
      'confirmed' as const, 
      'cancelled' as const, 
      'completed' as const, 
      'failed' as const
    ] as const;
    return (validStatuses as readonly string[]).includes(status);
  }

  private toDomain(e: ReservationEntity): Reservation {
    // Ensure the status is a valid ReservationStatus
    const status = this.isReservationStatus(e.status) ? e.status : 'pending';
    
    // Convert transitFlightSeats from string[] to Record<string, string[]>
    const transitFlightSeats: Record<string, string[]> = {};
    if (Array.isArray(e.transitFlightSeats)) {
      // If it's an array, convert to object with default key for backward compatibility
      transitFlightSeats['default'] = e.transitFlightSeats;
    } else if (e.transitFlightSeats && typeof e.transitFlightSeats === 'object') {
      // If it's already an object, use it as is
      Object.assign(transitFlightSeats, e.transitFlightSeats);
    }
    
    return new Reservation(
      e.id,
      e.reservation_number,
      status,
      e.payment_status as PaymentStatus,
      e.client_id!,
      e.customer_id!,
      e.room_id,
      e.flight_id,
      e.trip_id,
      e.from_date,
      e.to_date,
      e.adult,
      e.children,
      e.infant || 0,
      e.rooms || 1,
      e.price || 0,
      e.seats || [],
      e.mainFlightSeats || [], // كراسي الرحلة الأساسية
      e.transitFlightSeats || [], // كراسي الرحلات الترانزيت
      e.returnFlightSeats || [], // كراسي رحلات العودة
      e.baggage,
      e.meals,
      e.extraBaggage,
      e.airportTransfer,
      e.unlimitedInternet,
      e.extras,
      e.name,
      e.email,
      e.gender,
      e.latitude ? parseFloat(e.latitude) : null,
      e.longitude ? parseFloat(e.longitude) : null,
      e.nationality,
      e.passport_number,
      e.passport_expiry && e.passport_expiry instanceof Date ? e.passport_expiry.toISOString().split('T')[0] : null,
      e.phone_number,

      e.date_of_birth && e.date_of_birth instanceof Date ? e.date_of_birth.toISOString().split('T')[0] : null,
      e.departure_date || null,
      e.return_date || null
    );
  }

  private toEntity(r: Reservation): Partial<ReservationEntity> {
    const entity: Partial<ReservationEntity> = {
      id: r.id,
      reservation_number: r.reservationNumber,
      status: r.status,
      client_id: r.clientId,
      customer_id: r.customerId,
      room_id: r.roomId,
      flight_id: r.flightId,
      trip_id: r.tripId,
      from_date: r.fromDate,
      to_date: r.toDate,
      adult: r.adult,
      children: r.children,
      infant: r.infant || 0,
      rooms: r.rooms || 1,
      price: r.price || 0,
      seats: r.seats || [],
      mainFlightSeats: r.mainFlightSeats || [], // كراسي الرحلة الأساسية
      transitFlightSeats: r.transitFlightSeats || [], // كراسي الرحلات الترانزيت
      returnFlightSeats: r.returnFlightSeats || [], // كراسي رحلات العودة
      baggage: r.baggage,
      meals: r.meals,
      extraBaggage: r.extraBaggage,
      airportTransfer: r.airportTransfer,
      unlimitedInternet: r.unlimitedInternet,
      extras: r.extras,
      name: r.name || null,
      email: r.email || null,
      gender: r.gender || null,
      departure_date: r.departureDate || null,
      return_date: r.returnDate || null,
      nationality: r.nationality || null,
      passport_number: r.passportNumber || null,
      phone_number: r.phoneNumber || null
    };

    // Handle decimal fields
    if (typeof r.latitude === 'number') {
      entity.latitude = r.latitude.toString();
    } else if (r.latitude === null || r.latitude === undefined) {
      entity.latitude = null;
    }

    if (typeof r.longitude === 'number') {
      entity.longitude = r.longitude.toString();
    } else if (r.longitude === null || r.longitude === undefined) {
      entity.longitude = null;
    }

    // Handle date fields
    if (r.passportExpiry) {
      entity.passport_expiry = new Date(r.passportExpiry);
    } else {
      entity.passport_expiry = null;
    }

    if (r.dateOfBirth) {
      entity.date_of_birth = new Date(r.dateOfBirth);
    } else {
      entity.date_of_birth = null;
    }

    return entity;
  }

  async findById(id: string) {
    const e = await this.repo.findOneBy({ id });
    return e ? this.toDomain(e) : null;
  }

  async findAllByClient(clientId: string) {
    const es = await this.repo.findBy({ client_id: clientId });
    return es.map(e => this.toDomain(e));
  }

  async findAndCount(
    filters: FilterReservationDTO
  ): Promise<[Reservation[], number]> {
    let qb = this.repo
      .createQueryBuilder("r")
      .leftJoin(CustomerEntity, "cust", "cust.id = r.customer_id");

    if (filters.clientId) {
      qb = qb.where("r.client_id = :clientId", {
        clientId: filters.clientId,
      });
    }
    
    if (filters.customerId) {
      qb = qb.andWhere("r.customer_id = :customerId", {
        customerId: filters.customerId,
      });
    }
    if (filters.customerType) {
      qb = qb.andWhere("cust.customer_type = :ct", {
        ct: filters.customerType,
      });
    }
    if (filters.status) {
      qb = qb.andWhere("r.status = :status", { status: filters.status });
    }
    
    // First join all necessary tables if we're doing category filtering
    if (filters.category) {
      qb = qb
        .leftJoin('rooms', 'rm', 'rm.id = r.room_id')
        .leftJoin('flights', 'f', 'f.id = r.flight_id')
        .leftJoin('trips', 't', 't.id = r.trip_id');
    }

    // Handle service type and category filtering
    if (filters.serviceType) {
      if (filters.serviceType === "room") {
        qb = qb.andWhere("r.room_id IS NOT NULL");
        
        // Add category filter for rooms
        if (filters.category) {
          qb = qb.andWhere('LOWER(rm.category) LIKE LOWER(:category)', { 
            category: `%${filters.category}%`
          });
        }
      } else if (filters.serviceType === "flight") {
        qb = qb.andWhere("r.flight_id IS NOT NULL");
        
        // Add category filter for flights (e.g., economy, business, first class)
        if (filters.category) {
          qb = qb.andWhere('LOWER(f.class) LIKE LOWER(:category)', { 
            category: `%${filters.category}%`
          });
        }
      } else if (filters.serviceType === "trip") {
        qb = qb.andWhere("r.trip_id IS NOT NULL");
        
        // Add category filter for trips
        if (filters.category) {
          qb = qb.andWhere('LOWER(t.category) LIKE LOWER(:category)', { 
            category: `%${filters.category}%`
          });
        }
      }
    } else if (filters.category) {
      // If no specific service type is selected but category is provided,
      // search across all service types
      qb = qb.andWhere('(LOWER(rm.category) LIKE LOWER(:category) OR ' +
                      'LOWER(f.class) LIKE LOWER(:category) OR ' +
                      'LOWER(t.category) LIKE LOWER(:category))', {
                        category: `%${filters.category}%`
                      });
    }
    
    // Date range filters
    if (filters.fromDate) {
      qb = qb.andWhere("r.created_at >= :from", { from: filters.fromDate });
    }
    if (filters.toDate) {
      const endOfDay = new Date(filters.toDate);
      endOfDay.setHours(23, 59, 59, 999);
      qb = qb.andWhere("r.created_at <= :to", { to: endOfDay });
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    qb = qb
      .orderBy("r.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, total] = await qb.getManyAndCount();
    const items = entities.map((e) => {
      const status = this.isReservationStatus(e.status) ? e.status : 'pending';
      
      // Convert transitFlightSeats from string[] to Record<string, string[]>
      const transitFlightSeats: Record<string, string[]> = {};
      if (Array.isArray(e.transitFlightSeats)) {
        // If it's an array, convert to object with default key for backward compatibility
        transitFlightSeats['default'] = e.transitFlightSeats;
      } else if (e.transitFlightSeats && typeof e.transitFlightSeats === 'object') {
        // If it's already an object, use it as is
        Object.assign(transitFlightSeats, e.transitFlightSeats);
      }
      
      return new Reservation(
        e.id,
        e.reservation_number,
        status,
        e.payment_status as PaymentStatus,
        e.client_id!,
        e.customer_id!,
        e.room_id,
        e.flight_id,
        e.trip_id,
        e.from_date,
        e.to_date,
        e.adult,
        e.children,
        e.infant,
        e.rooms,
        e.price,
        e.seats || [], // استخدام e.seats بدلاً من e.seat
        e.mainFlightSeats || [], // كراسي الرحلة الأساسية
        e.transitFlightSeats || [], // كراسي الرحلات الترانزيت
        e.returnFlightSeats || [], // كراسي رحلات العودة
        e.baggage,
        e.meals,
        e.extraBaggage,
        e.airportTransfer,
        e.unlimitedInternet,
        e.extras,
        e.name || null,
        e.email || null,
        e.gender || null,
        e.latitude ? parseFloat(e.latitude) : null,
        e.longitude ? parseFloat(e.longitude) : null,
        e.nationality || null,
        e.passport_number || null,
        e.passport_expiry && e.passport_expiry instanceof Date ? e.passport_expiry.toISOString().split('T')[0] : null,
        e.phone_number || null,
        e.date_of_birth && e.date_of_birth instanceof Date ? e.date_of_birth.toISOString().split('T')[0] : null
      );
    });
    
    return [items, total];
  }

  async countByStatusesBetween(
    statuses: string[],
    start: Date,
    end: Date
  ): Promise<number> {
    return this.repo
      .createQueryBuilder("r")
      .where("r.status IN (:...statuses)", { statuses })
      .andWhere("r.created_at BETWEEN :start AND :end", { start, end })
      .getCount();
  }

  async create(reservation: Reservation): Promise<void> {
    const e = this.repo.create(this.toEntity(reservation));
    await this.repo.save(e);
  }

  async update(reservation: Reservation): Promise<void> {
    const e = await this.repo.findOneBy({ id: reservation.id });
    if (!e) throw new Error("Reservation not found");

    // Convert domain model to entity and update all fields
    const updatedEntity = this.toEntity(reservation);
    Object.assign(e, updatedEntity);
    
    // Save the updated entity
    await this.repo.save(e);
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }
}
