import { HttpResponse } from '../interfaces/http';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export const ok = (body: any): HttpResponse => ({
  statusCode: 200,
  body,
});
