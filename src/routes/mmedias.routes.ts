import { Router } from 'express';
import AppError from '../errors/AppError';

import {
  boletim2JSON,
  getBoletim,
  getPlanoEnsino,
  logInAndObtainCookie,
} from '../utils/mmediasUtils';

const mmediasRoutes = Router();

mmediasRoutes.post('/', async (request, response) => {
  const { RA, password } = request.body;

  const cookie = await logInAndObtainCookie(RA, password);

  if (!cookie) {
    throw new AppError('Não foi possível realizar login');
  }

  const boletimHtml = await getBoletim(cookie);

  if (!boletimHtml) {
    throw new AppError('Não foi possível obter boletim');
  }

  const dados_usuario = boletim2JSON(boletimHtml as string);

  if (!boletimHtml) {
    throw new AppError('Não foi possível processar boletim');
  }

  const disciplinasObject = JSON.parse(dados_usuario.disciplinas);
  delete dados_usuario.disciplinas;
  dados_usuario.disciplinas = disciplinasObject;
  const dados_usuario_com_cookie = { cookie, ...dados_usuario };

  return response.json(dados_usuario_com_cookie);
});

mmediasRoutes.get('/', async (request, response) => {
  const { codigo, cookie } = request.body;

  const plano_ensino = await getPlanoEnsino(codigo, cookie);

  if (!plano_ensino) {
    throw new AppError('Não foi obter o plano de ensino');
  }

  return response.json(plano_ensino);
});

export default mmediasRoutes;
