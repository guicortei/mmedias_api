import { Request } from 'express';

export default function requestLoader(request: Request) {
  let req = request.body;
  // console.log(request.body);
  // console.log(request.query);
  if (Object.keys(req).length === 0) {
    req = request.query;
  }
  console.log(req);
  return req;
}
