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

mmediasRoutes.get('/lo', async (request, response) => {
  console.log('GET: login');
  const { RA, password, old_cookie } = requestLoader(request);

  let cookie = null;
  if (!old_cookie) {
    cookie = await logInAndObtainCookie(RA, password);
  } else if (old_cookie.length > 0) {
    cookie = old_cookie;
  }

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

mmediasRoutes.get('/pe', async (request, response) => {
  console.log('******* GET: plano de ensino');
  const { codigo, cookie, time_tolerance } = requestLoader(request);

  const plano_ensino = await getPlanoEnsino(codigo, cookie, time_tolerance);

  if (!plano_ensino) {
    throw new AppError('Não foi obter o plano de ensino');
  }

  return response.json(plano_ensino);
});

mmediasRoutes.get('/pes', async (request, response) => {
  console.log('******* GET: plano de ensino');
  const { codigos, cookie, time_tolerance } = requestLoader(request);

  const planos_ensino = [];
  const n = codigos.length;
  for (let i = 0; i < n; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const plano_ensino = await getPlanoEnsino(
      codigos[i],
      cookie,
      time_tolerance,
    );
    planos_ensino.push(plano_ensino);
  }

  if (planos_ensino.length === 0) {
    throw new AppError('Não foi obter o plano de ensino');
  }

  return response.json(planos_ensino);
});

export default mmediasRoutes;
