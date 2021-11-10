import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { HttpFailResponse } from '@/shared/interfaces';
import { I18nService } from 'nestjs-i18n';
import { ThrottlerException } from '@nestjs/throttler';

// Re-format error response of throttler
@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(_exception: ThrottlerException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const data: HttpFailResponse = {
      error: {
        message: await this.i18n.t('app.error_msg.too_many_request'),
        code: 20001,
      },
    };
    response.status(429).send(data); // Too Many Requests
  }
}
