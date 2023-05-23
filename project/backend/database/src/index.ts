import { AppDataSource } from "./data-source";
import express from 'express';
import cors from 'cors';
import foodRouter from '../src/router/food.router';
import userRouter from '../src/router/user.router';
import orderRouter from '../src/router/order.router';

const app = express();
const port = 3300;

AppDataSource.initialize().then(async () => {

    app.use(cors());
    app.use(express.json());

    app.use('/api/foods', foodRouter);
    app.use('/api/users', userRouter);
    app.use('/api/orders', orderRouter);

    app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });

}).catch(error => console.log(error))