import { JSDOM } from 'jsdom';
import https from 'https';
import requestModule from 'request';
import fs from 'fs';
import PDFParser from 'pdf2json';
import path from 'path';

export const boletim2JSON = (html: string) => {
  const dom = new JSDOM(html);
  const q = dom.window.document;

  // const aux = q.querySelector('#dados-aluno tr:nth-child(1) td:nth-child(2)').innerHTML;
  const name = q
    .querySelector('#dados-aluno tr:nth-child(1) td:nth-child(2) strong')
    .innerHTML.trim();

  const RA = q
    .querySelector('#dados-aluno tr:nth-child(1) td:nth-child(3) strong')
    .innerHTML.trim();

  const data_nasc = q
    .querySelector('#dados-aluno tr:nth-child(1) td:nth-child(4) strong')
    .innerHTML.trim();

  const email = q
    .querySelector('#dados-aluno tr:nth-child(2) td:nth-child(1) strong')
    .innerHTML.trim();

  const telefone = q
    .querySelector('#dados-aluno tr:nth-child(2) td:nth-child(2) strong')
    .innerHTML.trim();

  const celular = q
    .querySelector('#dados-aluno tr:nth-child(2) td:nth-child(3) strong')
    .innerHTML.trim();

  const curso = q
    .querySelector('#dados-aluno tr:nth-child(4) td:nth-child(2) a')
    .innerHTML.trim();

  const serie = q
    .querySelector('#dados-aluno tr:nth-child(4) td:nth-child(3)')
    .innerHTML.trim();

  const periodo = q
    .querySelector('#dados-aluno tr:nth-child(4) td:nth-child(4)')
    .innerHTML.trim();

  const exercicio = q
    .querySelector('#dados-aluno tr:nth-child(4) td:nth-child(5)')
    .innerHTML.trim();

  const nDisciplinas = q
    .querySelector('#notas tbody')
    .getElementsByTagName('tr').length;

  const countTH = q
    .querySelector('#notas thead tr')
    .getElementsByTagName('th').length;

  const thTexts = [];
  for (let j = 1; j <= countTH; j += 1) {
    const thText = q
      .querySelector(`#notas thead tr th:nth-child(${j})`)
      .textContent.trim();
    thTexts.push(thText);
  }

  const disciplinas = [];
  for (let i = 1; i <= nDisciplinas; i += 1) {
    const disciplinaTR = q.querySelector(`#notas tbody tr:nth-child(${i})`);
    const disciplinaOBJ = {};
    for (let j = 1; j <= countTH; j += 1) {
      const key = thTexts[j - 1];
      const value = disciplinaTR
        .querySelector(`td:nth-child(${j})`)
        .textContent.trim();
      if (
        disciplinaTR
          .querySelector(`td:nth-child(${j})`)
          .className.search('cinza-bloqueado') === -1
      ) {
        disciplinaOBJ[key] = value;
      }
    }
    const disc = disciplinaOBJ["Disciplina"].split(' - ')[1]; //eslint-disable-line
    const cod = disciplinaOBJ["Disciplina"].split(' - ')[0]; //eslint-disable-line
    disciplinaOBJ["Disciplina"] = disc //eslint-disable-line
    disciplinaOBJ["Codigo"] = cod //eslint-disable-line
    disciplinas.push(disciplinaOBJ);
  }

  const disciplinasJSON = JSON.stringify(disciplinas);
  // let disciplinas = [];

  return {
    RA,
    name,
    data_nasc,
    email,
    telefone,
    celular,
    curso,
    serie,
    periodo,
    exercicio,
    disciplinas: disciplinasJSON,
  };
};

export const getBoletim = (cookie: string) => {
  const options = {
    hostname: 'www2.maua.br',
    port: 443,
    path: '/mauanet.2.0/boletim-escolar',
    method: 'GET',
    headers: {
          'Cookie': cookie,// eslint-disable-line
    },
  };

  return new Promise((resolve, reject) => {
    https
      .request(options, res => {
        let body = '';
        res.on('data', chunk => {
          body += chunk;
        });
        res.on('end', () => {
          return resolve(body);
        });
      })
      .on('error', reject)
      .end();
  });
};

export const getHtmlWithCookie = (path: string, cookie: string) => {
  const options = {
    hostname: 'www2.maua.br',
    port: 443,
    path,
    method: 'GET',
    headers: {
          'Cookie': cookie,// eslint-disable-line
    },
  };

  return new Promise<string>((resolve, reject) => {
    https
      .request(options, res => {
        let body = '';
        res.on('data', chunk => {
          body += chunk;
        });
        res.on('end', () => {
          return resolve(body);
        });
      })
      .on('error', reject)
      .end();
  });
};

export const getSearchRedirectURL = (
  codigo: string,
  cookie: string,
): Promise<string> => {
  const options = {
    hostname: 'www2.maua.br',
    port: 443,
    path: `/mauanet.2.0/disciplinas/index/q/${codigo}`,
    method: 'GET',
    headers: {
          'Cookie': cookie,// eslint-disable-line
    },
  };

  return new Promise((resolve, reject) => {
    https
      .request(options, res => {
        res.on('data', () => {
          // let this function here
        });
        res.on('end', () => {
          return resolve(res.rawHeaders[15]);
        });
      })
      .on('error', reject)
      .end();
  });
};

export const getPdfFile = (
  url: string,
  filePath: string,
): Promise<fs.WriteStream> => {
  const file = fs.createWriteStream(filePath);
  return new Promise((resolve, reject) => {
    const req = https.request(url, resp => {
      resp.pipe(file);
      resp.on('end', () => {
        resolve(file);
      });
      resp.on('error', () => {
        reject();
      });
    });

    req.end();
  });
};

export const RA2email = (RA: string): string => {
  const numbers = RA.replace(/[^0-9]/g, '');
  const prefix = numbers.slice(0, 2);
  const aux = numbers.slice(-6);
  const sufix = aux.slice(0, 5);
  const digit = aux.slice(-1);
  const email = `${prefix}.${sufix}-${digit}@maua.br`;
  return email;
};

export const logInAndObtainCookie = (RA: string, password: string) => {
  return new Promise<string>((resolve, reject) => {
    const email = RA2email(RA);

    const optionsLogin = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url: 'https://www2.maua.br/mauanet.2.0',
      body: `maua_email=${email}&maua_senha=${password}`,
    };

    requestModule
      .post(optionsLogin, (err, res) => {
        const betterRes = JSON.parse(JSON.stringify(res));
        const setCookieStr = betterRes.headers['set-cookie'][0];
        resolve(setCookieStr);
      })
      .on('error', reject);
  });
};

export const pdf2text = (file: fs.WriteStream) => {
  return new Promise<string>((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);

    pdfParser
      .on('pdfParser_dataError', () => {
        reject();
      })
      .on('pdfParser_dataReady', () => {
        const text = pdfParser.getRawTextContent();
        resolve(text);
      })
      .loadPDF(file.path);
  });
};

export const fastMatch = (
  text: string,
  prefix: string,
  sufix: string,
): string => {
  const regExpression = new RegExp(
    `(?<=${prefix})(.|\r|\n)*?(?=${sufix})`,
    'g',
  );
  return text.match(regExpression)[0].trim();
};

export const getPlanoEnsino = async (
  codigo: string,
  cookie: string,
): Promise<object> => {
  const searchRedirectPath = await getSearchRedirectURL(codigo, cookie);
  console.log('searchRedirectPath:', searchRedirectPath);

  const searchHTML = await getHtmlWithCookie(searchRedirectPath, cookie);

  const plano_ensino_ID = fastMatch(
    searchHTML,
    '/arquivos/plano-ensino/id/',
    '"',
  );

  const pdfURL = `https://www2.maua.br/arquivos/plano-ensino/id/${plano_ensino_ID}`;
  console.log('pdfURL:', pdfURL);

  const file = await getPdfFile(
    pdfURL,
    path.resolve('planos_de_ensino', `${codigo}.pdf`),
  );
  console.log('-- pdf download ok');

  const text = await pdf2text(file);
  console.log('-- converted to text');

  const periodicidade = fastMatch(
    text,
    'Periodicidade:',
    'Carga horária total:',
  );

  const carga_horaria = fastMatch(
    text,
    'Carga horária total:',
    'Carga horária semanal:',
  );

  const blocoAvaliacao = fastMatch(text, 'AVALIAÇÃO', '--Page');

  const aux = fastMatch(text, 'Disciplina:Código da Disciplina:', 'Course:');

  const disciplina = aux.slice(0, -6);

  const codigoEncontrado = aux.slice(-6);

  const pesosTrabalho = blocoAvaliacao.match(/(?<=k[1-9]:)(.*?)(?=k|\n|\r)/g);

  const pesosTrabalhoTrim: string[] = [];

  if (pesosTrabalho) {
    pesosTrabalho.forEach(str => {
      pesosTrabalhoTrim.push(str.trim());
    });
  }

  const info = {
    codigo: codigoEncontrado,
    disciplina,
    periodicidade,
    carga_horaria,
    pesosTrabalhoTrim,
    pdfURL,
  };

  return info;
};