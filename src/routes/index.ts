import { Router } from 'express';
import appointmentsRoutes from './appointments.routes';
import sessionRoutes from './sessions.routes';
import usersRoutes from './users.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionRoutes);
routes.use('/appointments', appointmentsRoutes);

export default routes;
