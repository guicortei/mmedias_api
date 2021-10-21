import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new Error('Token is missing');
  }
  const [, token] = authHeader.split(' ');

  try {
    const tokenPayLoad = verify(token, jwtConfig.secret);
    const { sub: userId } = tokenPayLoad as JwtPayload;
    request.user = {
      id: userId,
    };
    return next();
  } catch {
    throw new Error('Invalid token');
  }
}
