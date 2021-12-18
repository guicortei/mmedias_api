import { Router } from 'express';
import requestLoader from '../utils/requestLoader';

const rootRoutes = Router();

rootRoutes.get('/', async (request, response) => {
  let req = requestLoader(request);

  if (Object.keys(req).length === 0) {
    req = { vazio: 'estou' };
  }

  return response.json(req);
});

export default rootRoutes;
