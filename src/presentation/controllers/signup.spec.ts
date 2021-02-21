import SignUpController from './signup';

describe('SignUp Controller', () => {
  test('should return statusCode 400 if no name is provided', async () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'email',
        password: 'password',
        passwordConfirmation: 'passwordConfirmation',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
