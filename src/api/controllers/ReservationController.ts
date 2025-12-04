import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { injectable, inject } from "inversify";
import { validationMiddleware } from "../middleware/validation.middleware";
import { TYPES } from "../../shared/di/types";
import { IReservationService } from "../../core/interfaces/services/IReservationService";

import {
  CreateReservationSchema,
  CreateReservationDTO,
} from "../../application/dto/CreateReservation.dto";
import {
  UpdateReservationSchema,
  UpdateReservationDTO,
} from "../../application/dto/UpdateReservation.dto";
import {
  FilterReservationSchema,
  FilterReservationDTO,
} from "../../application/dto/FilterReservation.dto";

import { PaymentService } from "../../application/services/PaymentService";
import { PaymentGateway } from "../../core/types/payment.types";

import { Payment } from "../../core/entities/Payment";
import { IAuthRepository } from "../../core/interfaces/repositories/IAuthRepository";
import { CustomerService } from "../../application/services/CustomerService";
import { ClientService } from "../../application/services/ClientService";
import { Customer } from "../../core/entities/Customer";
import ReservationPaymentService from "../../application/services/ReservationPaymentService";

// Type for the reservation response including customer details
interface ReservationResponse {
  id: string;
  reservationNumber: string;
  status: string;
  fromDate: string | null;
  toDate: string | null;
  departureDate: string | null;
  returnDate: string | null;
  adult: number | null;
  children: number | null;
  seats: string[];
  mainFlightSeats: string[];
  returnFlightSeats: string[];
  transitFlightSeats: Record<string, string[]>;
  baggage: string | null;
  meals: string | null;
  extraBaggage: string | null;
  airportTransfer: string | null;
  unlimitedInternet: string | null;
 

 
  extras?: any;
  customerWithAuth:any,
  client: any; // You might want to replace 'any' with a proper Client type
  category: Category;
}

type Category = null;
function determineCategory(obj: {}): Category {
  return null;
}

@injectable()
export class ReservationController {
  constructor(
    @inject(TYPES.IReservationService)
    private readonly svc: IReservationService,
    @inject(TYPES.ClientService)
    private readonly clientService: ClientService,
    @inject(TYPES.CustomerService)
    private readonly customerService: CustomerService,
    @inject(TYPES.PaymentService)
    private readonly paymentService: PaymentService,
    @inject(TYPES.ReservationPaymentService)
    private readonly reservationPaymentService: ReservationPaymentService,
    @inject(TYPES.AuthRepository)
    private readonly authRepo: IAuthRepository
  ) {}


  public create = [
    validationMiddleware(CreateReservationSchema, "body"),
    async (
      req: Request<ParamsDictionary, unknown, CreateReservationDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const dto = CreateReservationSchema.parse(req.body);
        
        // Create reservation with pending status only
        const reservation = await this.svc.createReservationOnly(dto);
        // const Customer = await this.customerService.findById(dto.customerId);
        // Get related entities for response
        let room = null;
        let flight = null;
        let trip = null;
        
        if (dto.serviceType === 'room' && dto.serviceId) {
         throw new Error('Room service is not supported');
        } else if (dto.serviceType === 'flight' && dto.serviceId) {
          throw new Error('Flight service is not supported');
        } else if (dto.serviceType === 'trip' && dto.serviceId) {
          throw new Error('Trip service is not supported');
        }

        const category = determineCategory({});
        
        // Build the response
        const response = {
          ...reservation,
          room: null,
          flight: null,
          // Customer,
          trip: null,
          category,
        };

        res.status(201).json(response);
      } catch (err) {
        next(err);
      }
    },
  ];

  public list = [
    validationMiddleware(FilterReservationSchema, "query"),
    async (
      req: Request<ParamsDictionary, unknown, unknown, FilterReservationDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const {
          data: raw,
          total,
          page,
          limit,
        } = await this.svc.listReservations(
          FilterReservationSchema.parse(req.query)
        );

        const paymentsByRes = new Map<string, Payment>();
        await Promise.all(
          raw.map(async (r: any) => {
            const { data: ps } = await this.paymentService.listPayments({
              reservationId: r.id,
              page: 1,
              limit: 1,
            });
            if (ps[0]) paymentsByRes.set(r.id, ps[0]);
          })
        );

        const results = await Promise.all(
          raw.map(async (r: any) => {
            try {
              const cust = await this.customerService.findById(r?.customer?.id);
              const au = await this.authRepo.findById(cust.authUserId);
              const customerWithAuth = {
                ...cust,
                authUser: au && {
                  id: au.id,
                  firstName: au.firstName!,
                  lastName: au.lastName!,
                  email: au.email!,
                  phoneNumber: au.phoneNumber ?? null,
                },
              };





              const category = determineCategory({
                
              });

              const client = await this.clientService.getClient(r.client.id);
              
              return {
                id: r.id,
                reservationNumber: r.reservationNumber,
                status: r.status,
                fromDate: r.fromDate,
                toDate: r.toDate,
                departureDate: r.departureDate || null,
                returnDate: r.returnDate || null,
                adult: r.adult,
                children: r.children,
                seats: r.seats,
                mainFlightSeats: r.mainFlightSeats,
                returnFlightSeats: r.returnFlightSeats,
                transitFlightSeats: r.transitFlightSeats,
                baggage: r.baggage,
                meals: r.meals,
                extraBaggage: r.extraBaggage,
                airportTransfer: r.airportTransfer,
                unlimitedInternet: r.unlimitedInternet,
               
                extras: r.extras,
                customerWithAuth,
                
                client,
              
                room: null,
                flight: null,
                trip: null,
                category,
                payment: paymentsByRes.get(r.id) ?? null,
              } as ReservationResponse;
            } catch (error) {
              console.error(`Error processing reservation ${r.id}:`, error);
              return null;
            }
          })
        );
        
        const data = results.filter((r: any): r is ReservationResponse => r !== null);

        res.json({ data, total, page, limit });
      } catch (err) {
        next(err);
      }
    },
  ];

  public get = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const r = await this.svc.get(req.params.id);

      const client = await this.clientService.getClient(r.clientId);

      const cust = await this.customerService.findById(r.customerId);
      const au = await this.authRepo.findById(cust.authUserId);
      const customerWithAuth = {
        ...cust,
        authUser: au && {
          id: au.id,
          firstName: au.firstName!,
          lastName: au.lastName!,
          email: au.email!,
          phoneNumber: au.phoneNumber ?? null,
        },
      };

      const room = null;

      let flight: null = null;


      const trip = null;

      const category = determineCategory({});

      const { data: ps } = await this.paymentService.listPayments({
        reservationId: r.id,
        page: 1,
        limit: 1,
      });
      const payment: Payment | null = ps[0] ?? null;

      res.json({
        id: r.id,
        reservationNumber: r.reservationNumber,
        status: r.status,
        fromDate: r.fromDate,
        toDate: r.toDate,
        departureDate: r.departureDate || null,
        returnDate: r.returnDate || null,
        adult: r.adult,
        children: r.children,
        seats: r.seats,
        mainFlightSeats: r.mainFlightSeats,
        returnFlightSeats: r.returnFlightSeats,
        transitFlightSeats: r.transitFlightSeats,
        baggage: r.baggage,
        meals: r.meals,
        extraBaggage: r.extraBaggage,
        airportTransfer: r.airportTransfer,
        unlimitedInternet: r.unlimitedInternet,
       
        extras: r.extras,
        customerWithAuth,
        client,
     
        room,
        flight,
        trip,
        category,
        payment,
      });
    } catch (err) {
      next(err);
    }
  };
  public update = [
    validationMiddleware(UpdateReservationSchema, "body"),
    async (
      req: Request<{ id: string }, unknown, UpdateReservationDTO>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const dto = UpdateReservationSchema.parse(req.body);
        const base = await this.svc.update(req.params.id, dto);

        const room = null;
        const flight = null;
        const trip = null;
        const category = determineCategory({});

        const { data: payments } = await this.paymentService.listPayments({
          reservationId: base.id,
          page: 1,
          limit: 1,
        });
        const payment: Payment | null =
          payments.length > 0 ? payments[0] : null;

        res.json({
          ...base,
          room,
          flight,
          trip,
          category,
          payment,
        });
      } catch (err) {
        next(err);
      }
    },
  ];


  public delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.svc.delete(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  };

  // Handle payment callbacks (success/failure)
  public handlePaymentWebhook = async (
    req: Request<{ gateway: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { gateway } = req.params;
      
      if (!['stripe', 'tamara', 'mimo'].includes(gateway)) {
        return res.status(400).json({ error: 'Unsupported payment gateway' });
      }

      // Process the webhook
      await this.reservationPaymentService.handlePaymentWebhook(
        gateway as PaymentGateway,
        req.body
      );
      
      // Acknowledge receipt of the webhook
      res.status(200).json({ received: true });
    } catch (err) {
      console.error('Error processing payment webhook:', err);
      next(err);
    }
  };

  public cancelReservation = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const reservation = await this.reservationPaymentService.cancelReservation(id);
      
      res.json({
        success: true,
        reservationId: reservation.id,
        status: reservation.status,
        paymentStatus: reservation.paymentStatus
      });
    } catch (err) {
      next(err);
    }
  };
}
