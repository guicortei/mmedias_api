import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
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

    const token = sign({}, '97a708c92a318db8bf23fc0cef67e277', {
      subject: userFinded.id,
      expiresIn: '1d',
    });

    return { user: userFinded, token };
  }
}

export default CreateSessionService;
