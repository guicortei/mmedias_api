import { Router } from 'express';

const rootRoutes = Router();

rootRoutes.get('/:parametros', async (request, response) => {
  let req = request.body;
  console.log(request.body);
  console.log(request.query);
  console.log(request.params);
  if (Object.keys(req).length === 0) {
    req = request.body;
  }
  if (Object.keys(req).length === 0) {
    req = { vazio: 'estou' };
  }
  return response.json(req);
});

export default rootRoutes;
