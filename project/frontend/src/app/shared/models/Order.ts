import { CartItem } from "./CartItem";

export class Order{
    id!: number;
    items!: CartItem[];
    totalPrice!: number;
    name!: string;
    address!: string;
    phone!: string;
    createdAt!: Date;
    status!: string;
    estDel!: Date;
}