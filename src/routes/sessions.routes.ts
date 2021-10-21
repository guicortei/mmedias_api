import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionRoutes = Router();

sessionRoutes.post('/', async (request, response) => {
  const { email, password } = request.body;

  const createSession = new CreateSessionService();
  const { user, token } = await createSession.execute({
    email,
    password,
  });

  console.log(user);

  delete user.password;

  return response.json({ user, token });
});

export default sessionRoutes;
