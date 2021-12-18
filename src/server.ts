import 'reflect-metadata';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import bodyParser from 'body-parser';

import routes from './routes';
import AppError from './errors/AppError';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  }),
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(bodyParser.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(process.env.PORT || 3333, () => {
  console.log('🚀 Server started on port 3333');
});
