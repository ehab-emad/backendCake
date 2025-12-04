import { injectable, inject } from "inversify";
import { SummaryFilterDTO } from "../dto/SummaryFilter.dto";
// import { ITripRepository } from "../../core/interfaces/repositories/ITripRepository";
import { IReservationRepository } from "../../core/interfaces/repositories/IReservationRepository";
import { IPaymentRepository } from "../../core/interfaces/repositories/IPaymentRepository";
import { TYPES } from "../../shared/di/types";
import {
  sub,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
} from "date-fns";

export interface Summary {
  // numTrips: number;
  activeReservations: number;
  totalRevenue: number;
}

@injectable()
export class SummaryService {
  constructor(
    // @inject(TYPES.TripRepository) private trips: ITripRepository,
    @inject(TYPES.ReservationRepository)
    private reservations: IReservationRepository,
    @inject(TYPES.PaymentRepository) private payments: IPaymentRepository
  ) {}

  public async getSummary(filters: SummaryFilterDTO): Promise<Summary> {
    const { period } = filters;
    const now = new Date();
    let start: Date,
      end: Date = now;

    switch (period) {
      case "current_week":
        start = startOfWeek(now);
        break;
      case "current_month":
        start = startOfMonth(now);
        break;
      case "past_month":
        start = startOfMonth(sub(now, { months: 1 }));
        end = endOfMonth(sub(now, { months: 1 }));
        break;
      case "current_year":
        start = startOfYear(now);
        break;
      case "past_year":
        start = startOfYear(sub(now, { years: 1 }));
        end = endOfMonth(sub(now, { months: now.getMonth() + 1 }));
        break;
      default:
        start = startOfMonth(now);
    }

    // const numTrips = await this.trips.countCreatedBetween(start, end);
    const activeReservations = await this.reservations.countByStatusesBetween(
      ["pending", "confirmed"],
      start,
      end
    );
    const totalRevenue = await this.payments.sumByStatusBetween(
      ["paid"],
      start,
      end
    );

    return { activeReservations, totalRevenue };
  }
}
