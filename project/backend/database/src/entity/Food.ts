import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, ManyToOne, JoinTable } from 'typeorm';
import { Order } from './Order';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  preparationTime: number;

  @Column()
  imageUrl!: string;

  @ManyToMany(() => Order, order => order.foods, { onDelete: "CASCADE" })
  @JoinTable({
    name: 'order_foods',
    joinColumn: {
      name: 'food_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
  })
  orders: Order[];
  
}
