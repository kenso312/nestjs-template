import { BadRequestException } from '@nestjs/common';

export class PostNotFoundException extends BadRequestException {
  constructor(msg: string, errorCode: number) {
    super({ code: errorCode }, msg);
  }
}
