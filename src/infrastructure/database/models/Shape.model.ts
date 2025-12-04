import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ShapeImageEntity } from "./ShapeImage.model";
import { FlavorEntity } from "./Flavor.model";
import { MaskEntity } from "./Mask.model";

@Entity("shapes")
export class ShapeEntity {
  @PrimaryColumn({
    type: "char",
    length: "36",
    charset: "utf8mb4",
    collation: "utf8mb4_unicode_ci",
  })
  id!: string;

  @Column({ type: "varchar", length: "255" })
  name!: string;

  @Column({ name: "number_of_people", type: "int" })
  numberOfPeople!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  weight!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  width!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  height!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => ShapeImageEntity, (image) => image.shape)
  images!: ShapeImageEntity[];

  @OneToMany(() => FlavorEntity, (flavor) => flavor.shape)
  flavors!: FlavorEntity[];

  @OneToMany(() => MaskEntity, (mask) => mask.shape)
  masks!: MaskEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
