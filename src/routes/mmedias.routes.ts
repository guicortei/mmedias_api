import { Router } from 'express';
import AppError from '../errors/AppError';

import {
  boletim2JSON,
  getBoletim,
  getPlanoEnsino,
  logInAndObtainCookie,
} from '../utils/mmediasUtils';

const mmediasRoutes = Router();

let cookieGlobal = '';

mmediasRoutes.post('/', async (request, response) => {
  const { RA, password } = request.body;

  cookieGlobal = await logInAndObtainCookie(RA, password);

  if (!cookieGlobal) {
    throw new AppError('Não foi possível realizar login');
  }

  const boletimHtml = await getBoletim(cookieGlobal);

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

  return response.json(dados_usuario);
});

mmediasRoutes.get('/', async (request, response) => {
  const { codigo } = request.body;

  const plano_ensino = await getPlanoEnsino(codigo, cookieGlobal);

  if (!plano_ensino) {
    throw new AppError('Não foi obter o plano de ensino');
  }

  return response.json(plano_ensino);
});

export default mmediasRoutes;
