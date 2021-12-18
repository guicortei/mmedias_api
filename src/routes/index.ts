import { Router } from 'express';
import mmediasRoutes from './mmedias.routes';
import rootRoutes from './root.routes';

const routes = Router();

routes.use('/mmedias', mmediasRoutes);
routes.use('/', rootRoutes);

export default routes;
