import { Router } from "express";
import { Order } from "../entity/Order";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Oven } from "../entity/Oven";
import { addMinutes } from "date-fns";

const router = Router();

const repository = AppDataSource.getRepository(Order);
const repositoryUser = AppDataSource.getRepository(User);
const repositoryOven = AppDataSource.getRepository(Oven);

router.post('/create', async(req:any, res:any) =>{

    const order: Order = req.body;
    const name = req.body.name;
    const foodLength = req.body.items.length;

    //megkeressük az éppen rendelni kívánó usert
    const user = await repositoryUser.findOne({ where: { name: name } });

    //ha üres a kosár, akkor hibát küldünk vissza
    if(foodLength <= 0){
        res.status(400).send('A kosár üres');
        return;
    }

    //ha van már rendelés leadva, akkor visszadobunk valamilyen hibát, 
    //illetve ellenőrzöm, hogy van e már olyan rendelés aminek lejárt az ideje
    const findOrder = await repository.find({ where: { user: { id: user.id } } });
    for(let i=0; i<findOrder.length; i++){
        if(findOrder[i].status == "NEW" && (new Date() < findOrder[i].estDel)){
            res.status(400).send('Már volt leadva rendelés előzőleg, kérem várja meg a kiszállítását.');
            return;
        }else if(findOrder[i].status == "NEW" && (new Date() > findOrder[i].estDel)){
            findOrder[i].status = "DONE";
            await repository.save(findOrder[i]);
        }
    }

    //létrehozzuk az éppen leadni kívánt rendelést
    const newOrder = order;
    newOrder.foods = [];
    newOrder.createdAt = new Date();
    newOrder.user = user;

    //ha a totalprice nagyobb mint 5000, akkor kedvezményt adunk
    if(newOrder.totalPrice > 5000){
        newOrder.totalPrice = newOrder.totalPrice * 0.95;
    }

    //rendelni kívánt ételek elmentése
    for(let i=0; i<req.body.items.length; i++){
        newOrder.foods[i] = req.body.items[i].food;
    }

    // Az aktuális szabad sütők számának meghatározása
    const ovens = await repositoryOven.find();
    const availableOvens = ovens.filter((oven) => oven.busyUntil < new Date());

    //elmentjük a preparation timeokat ezáltal tudjuk, hogy hány ételre kell
    //lefoglalni a sütőket
    const bakingTimes = [];
    for(let i=0; i<req.body.items.length; i++){
        if(req.body.items[i].quantity > 1){
            for(let j=0; j < req.body.items[i].quantity; j++){
                bakingTimes[j] = req.body.items[i].food.preparationTime;
            }
        }else{
            bakingTimes[bakingTimes.length] = req.body.items[i].food.preparationTime;
        }
    }

    //ha több szabad sütő van, mint amennyit rendelni akarunk akkor egyértelmű a megoldás
    if(availableOvens.length >= bakingTimes.length){

        for(let j=0; j<bakingTimes.length; j++){
            const ovenIndex = j % availableOvens.length;
            availableOvens[ovenIndex].busyUntil = addMinutes(newOrder.createdAt, bakingTimes[j]);
        }

        //mivel az összes ételt el tudják egyből készíteni, ezért meg kell keresni,
        //melyik az amelyik a legtöbb időbe fog kerülni elkészíteni
        let maxBakingTime = 0;
        for(let i =0; i<bakingTimes.length; i++){
            if(bakingTimes[i]>maxBakingTime){
                maxBakingTime = bakingTimes[i];
            }
        }

        newOrder.estDel = addMinutes(newOrder.createdAt, maxBakingTime + 20);
        await repositoryOven.save(availableOvens);

    }else{

        let lastItemDone = ovens[0].busyUntil;

        for(let j=0; j<bakingTimes.length; j++){

            let availableSoon = ovens[0].busyUntil;
            let ovenIndex = 0;

            for(let i=0; i<ovens.length; i++){
                if(ovens[i].busyUntil < availableSoon){
                    availableSoon = ovens[i].busyUntil;
                    ovenIndex = i;
                }else if(ovens[i].busyUntil > lastItemDone){
                    lastItemDone = ovens[i].busyUntil;
                }
            }

            ovens[ovenIndex].busyUntil = addMinutes(availableSoon, bakingTimes[j]);

        }

        newOrder.estDel = addMinutes(lastItemDone, 20);
        await repositoryOven.save(ovens);

    }

    await repository.save(newOrder);
    res.send(newOrder);

})

router.get('/:userId', async (req, res) => {
    
    const userId = req.params.userId;
    try {
        const order = await repository.find({ where: { user: { id: userId } } });
        res.send(order);
    } catch (error) {
        res.status(404).send('Rendelés nem található');
    }

});

router.delete('/:userId', async (req, res) => {

    const userId = req.params.userId;
    const order = await repository.findOneOrFail({
        where: {
          user: { id: userId },
          status: 'NEW'
        }
    });

    try {
        await repository.remove(order);
        res.status(200).json('Rendelés sikeresen törölve.');
    } catch (error) {
      console.error('Rendelés törlése sikertelen:', error);
      res.status(500).send('Hiba történt a rendelés törlése közben.');
    }
    
});
  



export default router;
