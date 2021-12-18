import { Router } from 'express';
import AppError from '../errors/AppError';

import {
  boletim2JSON,
  getBoletim,
  getPlanoEnsino,
  logInAndObtainCookie,
} from '../utils/mmediasUtils';
import requestLoader from '../utils/requestLoader';

const mmediasRoutes = Router();

mmediasRoutes.post('/lo', async (request, response) => {
  const { RA, password } = requestLoader(request);

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

mmediasRoutes.post('/pe', async (request, response) => {
  const { codigo, cookie } = requestLoader(request);

  const plano_ensino = await getPlanoEnsino(codigo, cookie);

  if (!plano_ensino) {
    throw new AppError('Não foi obter o plano de ensino');
  }

  return response.json(plano_ensino);
});

export default mmediasRoutes;
