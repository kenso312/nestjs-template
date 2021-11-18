import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(message: string[]) {
    super({ message, isValidationError: true }, HttpStatus.BAD_REQUEST);
  }
}
