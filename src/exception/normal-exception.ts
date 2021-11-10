import { HttpException, HttpStatus } from '@nestjs/common';

export class NormalException extends HttpException {
  constructor(message: string, code: number, isTranslateKey = true) {
    super({ message, code, isTranslateKey }, HttpStatus.BAD_REQUEST);
  }
}
