import { Router } from 'express';

const rootRoutes = Router();

rootRoutes.get('/:params', async (request, response) => {
  let req = request.body;
  console.log(req);
  if (Object.keys(req).length === 0) {
    req = { vazio: 'estou' };
  }
  return response.json(req);
});

export default rootRoutes;
