import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Order } from "./entity/Order"
import { Oven } from "./entity/Oven"
import { Food } from "./entity/Food"
//import { OrderFood } from "./entity/OrderFood"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "pizzarendeles",
    synchronize: true,
    logging: false,
    entities: [User, Food, Oven, Order, /*OrderFood*/],
    migrations: [],
    subscribers: [],
})
