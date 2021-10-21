import { Router } from 'express';
import appointmentsRoutes from './appointments.routes';
import usersRoutes from './users.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/appointments', appointmentsRoutes);

export default routes;
