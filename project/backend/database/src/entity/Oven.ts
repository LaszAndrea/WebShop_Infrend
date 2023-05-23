import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Oven {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isBusy: boolean;

  @Column()
  busySince: Date;

}
