export default class ApiExposableError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    // Fixes instanceof bug in TypeScript
    Object.setPrototypeOf(this, ApiExposableError.prototype);
    this.statusCode = statusCode;
  }
}
