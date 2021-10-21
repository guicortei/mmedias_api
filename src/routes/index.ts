import { Router } from 'express';
import '../database';

const routes = Router();

routes.get('/', (request, response) =>
  response.json({ message: 'Hello World' }),
);

export default routes;
