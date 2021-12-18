import { Router } from 'express';
import mmediasRoutes from './mmedias.routes';

const routes = Router();

routes.use('/mmedias', mmediasRoutes);

export default routes;
