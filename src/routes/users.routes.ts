import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multerConfig';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/CreateUserService';
import UpdateAvatarService from '../services/UpdateAvatarService';

const usersRoutes = Router();
const upload = multer(multerConfig);

usersRoutes.post('/');

usersRoutes.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();
  const createdUser = await createUser.execute({
    name,
    email,
    password,
  });

  delete createdUser.password;

  return response.json(createdUser);
});

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateAvatar = new UpdateAvatarService();

    const user = await updateAvatar.execute({
      user_id: request.user.id,
      NewAvatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);
export default usersRoutes;
