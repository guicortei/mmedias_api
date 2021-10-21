import 'reflect-metadata';
import express from 'express';
import routes from './routes';
import './database';
import multerConfig from './config/multerConfig';

const app = express();

app.use(express.json());
app.use('/files', express.static(multerConfig.directory));
app.use(routes);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333');
});
