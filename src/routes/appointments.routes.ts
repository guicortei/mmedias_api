import { parseISO } from 'date-fns';
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRoutes = Router();

appointmentsRoutes.use(ensureAuthenticated);

appointmentsRoutes.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const { id: provider_id } = request.user;
  const appointments = await appointmentsRepository.find({
    where: { provider_id },
  });
  return response.json(appointments);
});

appointmentsRoutes.post('/', async (request, response) => {
  try {
    const { date } = request.body;
    const parsedDate = parseISO(date);
    const createAppointment = new CreateAppointmentService();
    const { id: provider_id } = request.user;
    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
    });
    return response.json(appointment);
  } catch ({ message: errorMessage }) {
    return response.status(400).json({ error: errorMessage });
  }
});

export default appointmentsRoutes;
