import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { EmployeeEntity } from "./Employee.model";

@Entity("employee_images")
export class EmployeeImageEntity {
  @PrimaryColumn({ type: "char", length: 36 }) id!: string;

  @Column({ name: "employee_id", type: "char", length: 36 })
  employeeId!: string;
  @ManyToOne(() => EmployeeEntity, (e) => e.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "employee_id" })
  employee!: EmployeeEntity;

  @Column({ type: "varchar", length: 255 }) path!: string;
  @CreateDateColumn({ name: "created_at" }) createdAt!: Date;
}
