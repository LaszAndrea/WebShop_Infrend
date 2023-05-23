import { Router } from "express";
import { Order } from "../entity/Order";
import { AppDataSource } from "../data-source";
//import auth from "../middlewares/auth.mid";
import { User } from "../entity/User";
import { Oven } from "../entity/Oven";

const router = Router();
//router.use(auth);

const repository = AppDataSource.getRepository(Order);
const repositoryUser = AppDataSource.getRepository(User);
const repositoryOven = AppDataSource.getRepository(Oven);

router.post('/create', async(req:any, res:any) =>{

    const order: Order = req.body;
    const name = req.body.name;
    const foodLength = req.body.items.length;
    
    const user = await repositoryUser.findOne({ where: { name: name } });

    if(foodLength <= 0){
        res.status(400).send('A kosár üres');
        return;
    }

    const newOrder = order;
    newOrder.foods = [];
    newOrder.createdAt = new Date();
    newOrder.user = user;

    let maxQuantity = 0;

    for(let i=0; i<foodLength; i++){
        maxQuantity += req.body.items[i].quantity;
    }

    for(let i=0; i<maxQuantity; i++){
        console.log(req.body.items[i].quantity);
        let actualQuantity = req.body.items[i].quantity;

        if(actualQuantity > 1){
            for(let j=0; j<actualQuantity; j++){
                newOrder.foods[i] = req.body.items[i].food;
            }
        }else{
            newOrder.foods[i] = req.body.items[i].food;
        }
    }

    // Az aktív rendelések és sütők lekérdezése az adatbázisból
    const ovens = await repositoryOven.find();

    // Az aktuális szabad sütők számának meghatározása
    const availableOvens = ovens.filter((oven) => !oven.isBusy);

    if(availableOvens.length >= newOrder.foods.length){

        for(let j=0; j<newOrder.foods.length; j++){
            const ovenIndex = j % availableOvens.length;
            availableOvens[ovenIndex].isBusy = true;
            availableOvens[ovenIndex].busySince = newOrder.createdAt;
        }

        await repositoryOven.save(availableOvens);

        let maxPrepTime = 0;

        for(let i=0; i<newOrder.foods.length; i++){

            if(newOrder.foods[i].preparationTime > maxPrepTime){
                maxPrepTime = newOrder.foods[i].preparationTime;
            }

        }

        console.log(newOrder.estDel);

    }

    await repository.save(newOrder);
    res.send(newOrder);

})

export default router;
