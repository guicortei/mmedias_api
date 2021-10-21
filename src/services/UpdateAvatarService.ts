import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import User from '../models/User';
import multerConfig from '../config/multerConfig';

interface Request {
  user_id: string;
  NewAvatarFilename: string;
}

export default class UpdateAvatarService {
  public async execute({ user_id, NewAvatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error('Only authenticated users can change avatar');
    }

    if (user.avatar) {
      const oldAvatarFilePath = path.join(multerConfig.directory, user.avatar);
      const oldAvatarFileExists = await fs.promises.stat(oldAvatarFilePath);
      if (oldAvatarFileExists) {
        await fs.promises.unlink(oldAvatarFilePath);
      }
    }

    user.avatar = NewAvatarFilename;

    usersRepository.save(user);

    return user;
  }
}
