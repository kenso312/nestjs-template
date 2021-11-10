import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { HttpFailResponse } from '@/utils/interfaces';

export const VALIDATION_ERROR = 'VALIDATION_ERROR';

interface ValidatorFailResponse {
  statusCode: number;
  message: string[] | string;
  error: string;
}

// Re-format error response of class-validator
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const badRequestResponse = <ValidatorFailResponse>exception.getResponse();

    // Since class-validator library will only throw BadRequestException, we need to do extra checking here,
    // all exception not related to validation will throw to all exception filter
    if (badRequestResponse.error !== VALIDATION_ERROR)
      throw new Error(exception.message);

    const finalResponse: HttpFailResponse = {
      error: {
        code: 20002,
        message: badRequestResponse.message[0],
      },
    };
    const response = host.switchToHttp().getResponse<FastifyReply>();
    response.status(422).send(finalResponse); // Unprocessable Entity
  }
}
