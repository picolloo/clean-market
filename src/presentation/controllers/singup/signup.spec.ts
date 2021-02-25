import SignUpController from './signup';
import { InvalidParamError, MissingParamError } from '../../errors';
import { AddUser, AddUserModel, EmailValidator } from './interfaces';
import { badRequest, ok } from '../../helpers/http';

interface SutTypes {
  sut: SignUpController;
  emailValidator: EmailValidator;
  addUser: AddUser;
}

const makeAddUserStub = (): AddUser => ({
  execute: (user: AddUserModel) =>
    Promise.resolve({
      ...user,
      id: 'valid_id',
    }),
});

const makeEmailValidatorStub = (): EmailValidator => ({
  validate: (_: string): boolean => true,
});

const makeSut = (): SutTypes => {
  const addUserStub = makeAddUserStub();
  const emailValidatorStub = makeEmailValidatorStub();

  return {
    sut: new SignUpController(emailValidatorStub, addUserStub),
    emailValidator: emailValidatorStub,
    addUser: addUserStub,
  };
};

describe('SignUp Controller', () => {
  test('should return statusCode 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'email@mail.com',
        password: 'password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('should return statusCode 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'name',
        password: 'password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('should return statusCode 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@mail.com',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('should return statusCode 400 if a invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut();
    jest.spyOn(emailValidator, 'validate').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: 'password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('should call emailValidator with the given email', async () => {
    const { sut, emailValidator } = makeSut();
    const validateSpy = jest.spyOn(emailValidator, 'validate');

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: 'password',
      },
    };
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  test('should call AddUser with the given values', async () => {
    const { sut, addUser } = makeSut();
    const addUserSpy = jest.spyOn(addUser, 'execute');

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: 'password',
      },
    };
    await sut.handle(httpRequest);
    expect(addUserSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('should return 200 when valid params are provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'name',
        email: 'email',
        password: 'password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(
      ok({
        ...httpRequest.body,
        id: 'valid_id',
      }),
    );
  });
});
