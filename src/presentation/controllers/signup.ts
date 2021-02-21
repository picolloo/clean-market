import { badRequest } from '../helpers/http';
import { MissingParamError, InvalidParamError } from '../errors';
import { Controller } from '../protocols/controller';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { EmailValidator } from '../validators';

export default class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const requiredFields = ['name', 'email', 'password'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const { email } = httpRequest.body;
    const validEmail = this.emailValidator.validate(email);

    if (!validEmail) {
      return badRequest(new InvalidParamError('email'));
    }

    return {
      statusCode: 200,
      body: true,
    };
  };
}
