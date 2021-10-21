import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const userFinded = await userRepository.findOne({
      where: { email },
    });

    if (!userFinded) {
      throw new Error('Invalid email/password combination.');
    }

    const passwordMatched = await compare(password, userFinded.password);

    if (!passwordMatched) {
      throw new Error('Invalid email/password combination.');
    }

    return { user: userFinded, token: 'here comes the token string' };
  }
}

export default CreateSessionService;
