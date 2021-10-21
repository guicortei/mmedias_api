import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const usersRoutes = Router();

usersRoutes.get('/', async (request, response) => {
  return response.send();
});

usersRoutes.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();
    const createdUser = await createUser.execute({
      name,
      email,
      password,
    });

    return response.json(createdUser);
  } catch ({ message: errorMessage }) {
    return response.status(400).json({ error: errorMessage });
  }
});

export default usersRoutes;
