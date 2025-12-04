import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity("reservations")
export class ReservationEntity {
  @PrimaryColumn("char", { length: 36 }) id!: string;

  @Column({ name: "reservation_number", length: 50, unique: true })
  reservation_number!: string;

  @Column({ length: 20 }) status!: string;

  @Column({ name: "payment_status", length: 20, default: 'pending' })
  payment_status!: string;

  @Column({ name: "payment_id", type: "varchar", length: 50, nullable: true })
  payment_id!: string | null;

  @Column("char", { name: "client_id", length: 36, nullable: true })
  client_id!: string | null;

  @Column("char", { name: "customer_id", length: 36, nullable: true })
  customer_id!: string | null;

  @Column("char", { name: "room_id", length: 36, nullable: true })
  room_id!: string | null;

  @Column("char", { name: "flight_id", length: 36, nullable: true })
  flight_id!: string | null;

  @Column("char", { name: "trip_id", length: 36, nullable: true })
  trip_id!: string | null;

  @Column("date", { name: "from_date", nullable: true })
  from_date!: string | null;

  @Column("date", { name: "to_date", nullable: true })
  to_date!: string | null;

  @Column("date", { name: "departure_date", nullable: true })
  departure_date!: string | null;

  @Column("date", { name: "return_date", nullable: true })
  return_date!: string | null;

  @Column("int", { nullable: true })
  adult!: number | null;

  @Column("int", { nullable: true })
  children!: number | null;

  @Column("int", { nullable: true, default: 0 })
  infant!: number | null;

  @Column("int", { nullable: true, default: 1 })
  rooms!: number | null;

  @Column("decimal", { precision: 10, scale: 2, nullable: true, default: 0.00 })
  price!: number | null;

  @Column('json', { nullable: true })
  seats!: string[] | null;

  @Column('json', { name: 'main_flight_seats', nullable: true })
  mainFlightSeats!: string[];

  @Column('json', { name: 'transit_flight_seats', nullable: true })
  transitFlightSeats!: string[];

  @Column('json', { name: 'return_flight_seats', nullable: true })
  returnFlightSeats!: string[];


  @Column("varchar", { length: 50, nullable: true })
  baggage!: string | null;

  @Column('simple-json', { nullable: true })
  meals!: { name?: string; totalPrice: number } | null;

  @Column('simple-json', { name: "extra_baggage", nullable: true })
  extraBaggage!: { name?: string; totalPrice: number } | null;

  @Column('simple-json', { name: "airport_transfer", nullable: true })
  airportTransfer!: { name?: string; totalPrice: number } | null;

  @Column('simple-json', { name: "unlimited_internet", nullable: true })
  unlimitedInternet!: { name?: string; totalPrice: number } | null;

  @Column('json', { nullable: true })
  extras: any;

  // New customer details fields
  @Column({ name: "name", type: "varchar", length: 255, nullable: true })
  name!: string | null;

  @Column({ name: "email", type: "varchar", length: 255, nullable: true })
  email!: string | null;

  @Column({ name: "gender", type: "varchar", length: 20, nullable: true })
  gender!: string | null;

  @Column({ name: "latitude", type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude!: string | null;

  @Column({ name: "longitude", type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude!: string | null;

  @Column({ name: "nationality", type: "varchar", length: 100, nullable: true })
  nationality!: string | null;

  @Column({ name: "passport_number", type: "varchar", length: 50, nullable: true })
  passport_number!: string | null;

  @Column({ name: "passport_expiry", type: "date", nullable: true })
  passport_expiry!: Date | null;

  @Column({ name: "phone_number", type: "varchar", length: 20, nullable: true })
  phone_number!: string | null;

  @Column({ name: "date_of_birth", type: "date", nullable: true })
  date_of_birth!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  created_at!: Date;
}
