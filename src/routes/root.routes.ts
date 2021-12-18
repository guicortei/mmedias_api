import { Router } from 'express';

const rootRoutes = Router();

rootRoutes.get('/', async (request, response) => {
  return response.json({ message: 'Hello World!' });
});

export default rootRoutes;
