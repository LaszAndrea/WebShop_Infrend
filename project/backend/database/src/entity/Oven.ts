import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Oven {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  busyUntil: Date;

}
