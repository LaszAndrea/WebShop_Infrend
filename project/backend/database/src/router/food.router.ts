import { Request, Response, Router } from 'express';
import { Food } from '../entity/Food';
import { AppDataSource } from '../data-source';

const router = Router();
const repository = AppDataSource.getRepository(Food);

router.get('/', async (_, res) => {
  const foods = await repository.find();
  res.send(foods);
});

router.get('/search/:searched', async (req, res) => {
  const searched = req.params.searched;
  const foods = await repository
    .createQueryBuilder('food')
    .where('LOWER(food.description) LIKE LOWER(:searched)', { searched: `%${searched}%` })
    .orWhere('LOWER(food.name) LIKE LOWER(:searched)', { searched: `%${searched}%` })
    .getMany();
  res.send(foods);
});

router.get('/:foodId', async (req, res) => {
  const foodId = req.params.foodId;
  const food = await repository.findOneById(foodId);
  res.send(food);
});

router.post('/', (req: Request, res: Response) => {
  const { name, price, description, preparationTime, imageUrl } = req.body;

  const newFood: Partial<Food> = {
    name,
    price,
    description,
    preparationTime,
    imageUrl
  };

  repository.save(newFood)
    .then((savedFood) => {
      res.status(201).json(savedFood);
    })
    .catch((error) => {
      res.status(499).json({ error: 'Hiba történt az étel mentésekor.' });
    });
    
});

router.put('/:foodId', async (req, res) => {
  const foodId = req.params.foodId;
  const { name, price, description, preparationTime, imageUrl } = req.body;

  try {
    const food = await repository.findOneById(foodId);
    if (!food) {
      res.status(404).json({ error: 'Az étel nem található.' });
      return;
    }

    food.name = name;
    food.price = price;
    food.description = description;
    food.preparationTime = preparationTime;
    food.imageUrl = imageUrl;

    const updatedFood = await repository.save(food);
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt az étel frissítésekor.' });
  }
});

router.delete('/:foodId', async (req, res) => {

  const foodId = req.params.foodId;
  const food = await repository.findOneOrFail({
      where: {
        id: foodId
      }
  });

  try {
      await repository.remove(food);
      res.status(200).json('Étel sikeresen törölve.');
  } catch (error) {
    console.error('Étel törlése sikertelen:', error);
    res.status(500).send('Hiba történt a rendelés törlése közben.');
  }
  
});


export default router;