import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { I18nService } from 'nestjs-i18n';

export interface HttpFailResponse {
  readonly error: {
    readonly message: string;
    readonly code: number;
  };
}

interface Exception {
  readonly response: {
    readonly message?: string;
    readonly code?: number;
    readonly isTranslateKey?: boolean;
  };
  readonly status: number;
  readonly message: string;
  readonly name: string;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: Exception, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();

    // Extract extract error message and translate [only NormalException has isTranslateKey attribute]
    const message =
      exception.response?.isTranslateKey && exception.response?.message
        ? await this.i18n.t(exception.response.message)
        : exception?.message;

    const data: HttpFailResponse = {
      error: {
        message: message || (await this.i18n.t('app.error_msg.unexpected')),
        code: exception.response?.code || 20000,
      },
    };
    response.status(400).send(data); // Bad Request
  }
}
