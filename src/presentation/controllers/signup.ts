import { badRequest } from '../helpers/http';
import { MissingParamError } from '../errors';
import { Controller } from '../protocols/controller';
import { HttpRequest, HttpResponse } from '../protocols/http';

export default class SignUpController implements Controller {
  handle = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    const requiredFields = ['name', 'email', 'password'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    return {
      statusCode: 200,
      body: true,
    };
  };
}
