import { badRequest } from '../../helpers/http';
import { MissingParamError, InvalidParamError } from '../../errors';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  AddUser,
} from './interfaces';

export default class SignUpController implements Controller {
  private readonly addUser: AddUser;

  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator, addUser: AddUser) {
    this.emailValidator = emailValidator;
    this.addUser = addUser;
  }

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const requiredFields = ['name', 'email', 'password'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const { name, email, password } = httpRequest.body;
    const validEmail = this.emailValidator.validate(email);

    if (!validEmail) {
      return badRequest(new InvalidParamError('email'));
    }

    const user = await this.addUser.execute({ name, email, password });

    return {
      statusCode: 200,
      body: user,
    };
  };
}
