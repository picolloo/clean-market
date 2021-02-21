import SignUpController from './signup';
import { MissingParamError } from '../errors';

describe('SignUp Controller', () => {
  test('should return statusCode 400 if no name is provided', async () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'email',
        password: 'password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('should return statusCode 400 if no email is provided', async () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'name',
        password: 'password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('should return statusCode 400 if no password is provided', async () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
});
