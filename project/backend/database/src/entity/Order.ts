/*import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { OrderStatusEnum } from '../constants/order_status';
import { Food } from './Food';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToMany(() => Food, food => food.orders)
  @JoinTable()
  items: Food[];

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Column()
  totalPrice:number;
  
  @Column()
  status: OrderStatusEnum;

  @Column()
  sentAt: Date;

  @Column()
  estDel: Date;
  
}*/

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable} from 'typeorm';
import { Food } from './Food';
import { User } from './User';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  totalPrice: number;

  @Column()
  status: string;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToMany(() => Food, food => food.orders, { onDelete: "CASCADE" })
  @JoinTable({
    name: 'order_foods',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'food_id',
      referencedColumnName: 'id',
    },
  })
  foods: Food[];

  @Column()
  createdAt: Date;

  @Column()
  estDel: Date;

  @Column()
  address: string;

}

