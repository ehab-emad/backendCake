import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { AuthEntity } from "./Auth.model";
import { EmployeeImageEntity } from "./EmployeeImage.model";

@Entity("employees")
export class EmployeeEntity {
  @PrimaryColumn({ type: "char", length: 36 }) id!: string;

  @Column({ name: "auth_user_id", type: "char", length: 36 })
  authUserId!: string;
  @ManyToOne(() => AuthEntity, (u) => u.employees, { onDelete: "CASCADE" })
  @JoinColumn({ name: "auth_user_id" })
  authUser!: AuthEntity;

  @Column({ type: "varchar", length: 255, nullable: true })
  address?: string;
  @Column({
    name: "profile_image",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  profileImage?: string;

  @Column({ type: "varchar", length: 100 })
  role!: string;
  @Column({ type: "boolean", default: true })
  active!: boolean;

  @OneToMany(() => EmployeeImageEntity, (img) => img.employee)
  images!: EmployeeImageEntity[];

  @CreateDateColumn({ name: "created_at" }) createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" }) updatedAt!: Date;
}
