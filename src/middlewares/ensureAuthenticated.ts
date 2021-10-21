import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import AppError from '../errors/AppError';

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError('Token is missing');
  }
  const [, token] = authHeader.split(' ');

  try {
    const tokenPayLoad = verify(token, jwtConfig.secret);
    const { sub: userId } = tokenPayLoad as JwtPayload;
    request.user = { id: userId, ...request.user };
    return next();
  } catch {
    throw new AppError('Invalid token');
  }
}
