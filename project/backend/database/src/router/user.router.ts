import { Request, Response, Router } from 'express';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { AppDataSource } from '../data-source';


const router = Router();
router.use(bodyParser.json());
const repository = AppDataSource.getRepository(User);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await repository.findOne({ where: { email, password } });

    if (user) {
        res.send(generateTokenResponse(user));
    } else {
      res.status(400).send('Az email vagy a jelszó nem helyes.');
    }
  } catch (error) {
    res.status(500).send('Hiba történt a bejelentkezés során.');
  }
});

router.post('/registration', (req: Request, res: Response) => {
    const { name, email, password, address, phone } = req.body;
  
    const newUser: Partial<User> = {
        name,
        email: email.toLowerCase(),
        password,
        address,
        phone,
        isAdmin: false,
        orders: null
    };
  
    repository.save(newUser)
      .then((savedUser) => {
        res.status(201).json(savedUser);
      })
      .catch((error) => {
        res.status(499).json({ error: 'Hiba történt a felhasználó mentésekor.' });
      });
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

    /*const token = jwt.sign({
        id: user.id, email:user.email, isAdmin:user.isAdmin
    }, process.env.JWT_SECRET!,{
        expiresIn: "30d"
    });

    return {
      id: user.id,
      email: user.email,
      name:user.name,
      address: user.address,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: token
    }*/

}

export default router;

/*import {Router} from 'express';
import jwt from "jsonwebtoken";
import bodyParser from 'body-parser'

const router = Router();
router.use(bodyParser.json());

router.post("/login", (req,res)=> {

    const {email, password} = req.body;
    const user = sample_users.find(user => user.email === email &&
        user.password === password)

    if(user){
        res.send(generateTokenResponse(user));
    }else{
        res.status(400).send("Az email vagy a jelszó nem helyes.");
    }

});

const generateTokenResponse = (user:any) =>{

    const token = jwt.sign({
        email:user.email, isAdmin:user.isAdmin
    }, "ValamiRandom",{
        expiresIn: "30d"
    })

    user.token = token;
    return user;
}

export default router;*/
