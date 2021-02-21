export default interface EmailValidator {
  validate(email: string): boolean;
}
