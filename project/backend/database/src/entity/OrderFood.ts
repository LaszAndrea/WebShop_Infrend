/*import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { Food } from "./Food";

@Entity()
export class OrderFood {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @ManyToOne(() => Food, food => food.orderFoods)
  food: Food;

}*/
