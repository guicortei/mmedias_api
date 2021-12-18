import { Router } from 'express';

const rootRoutes = Router();

rootRoutes.get('/', async (request, response) => {
  const req = request.body;
  console.log(req);
  return response.json(req);
});

export default rootRoutes;
