import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { HttpFailResponse } from '@/shared/interfaces';
import { ValidationException } from '@/exception/validation-exception';

// Re-format error response of class-validator
@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const exceptionResponse = <{ message: string[] }>exception.getResponse();

    const data: HttpFailResponse = {
      error: {
        code: 20002,
        message: exceptionResponse.message[0],
      },
    };
    response.status(422).send(data); // Unprocessable Entity
  }
}
