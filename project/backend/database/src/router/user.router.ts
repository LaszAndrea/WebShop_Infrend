import { Request, Response, Router } from 'express';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcrypt';


const router = Router();
router.use(bodyParser.json());
const repository = AppDataSource.getRepository(User);

router.post('/login', async (req, res) => {

  try {
    const user = await repository.findOne({
        where: { email: req.body.email }
    });

    if (!user) {
      res.status(400).send('Az email vagy a jelszó nem helyes.');
    }

    const passwordMatches = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatches) {
        res.status(401).send('Az email vagy a jelszó nem helyes.');
    }

    res.send(generateTokenResponse(user));
  } catch (err) {
    handleError(res, err);
  }
});

router.post('/registration', async (req: Request, res: Response) => {

  try {
    const entity = repository.create(req.body as object);
    entity.id = null;

    entity.password = await bcrypt.hash(entity.password, 12);

    const result = repository.save(entity);
    delete (await result).password;
    
    res.json(result);
  } catch (err) {
    handleError(res, err);
  }

});
  
const generateTokenResponse = (user:any) =>{

    const token = jwt.sign({
        email:user.email, isAdmin:user.isAdmin
    }, "ValamiRandom",{
        expiresIn: "30d"
    })

    return {
        id: user.id,
        email: user.email,
        name:user.name,
        address: user.address,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: token
      }

}

function handleError(res: Response<any, Record<string, any>>, err: any) {
  throw new Error('Function not implemented.');
}

export default router;
