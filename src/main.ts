import {
  AllExceptionFilter,
  ThrottlerExceptionFilter,
  ValidationExceptionFilter,
} from './filter/_index';
import { AppModule } from '@/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { I18nService } from 'nestjs-i18n';
import { NestFactory } from '@nestjs/core';
import { ResponseInterceptor } from '@/interceptor/response.interceptor';
import { ValidationError } from 'class-validator';

(async () => {
  const fastifyAdapter = new FastifyAdapter({
    logger: process.env.LOGGING === 'true',
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
  );

  const i18n = app.get<I18nService>(I18nService);
  fastifyAdapter.setErrorHandler(async (error, _request, reply) => {
    reply.send({
      error:
        error instanceof SyntaxError
          ? { message: await i18n.t('app.error_msg.json_parse'), code: -10000 }
          : { message: await i18n.t('app.error_msg.unexcepted'), code: -10001 },
    });
  });

  // https://docs.nestjs.com/techniques/versioning#versioning
  app.enableVersioning();

  // Enable this if you have CORS issue in local development
  // app.enableCors();

  app.setGlobalPrefix('api');

  // Allowing to do validation through DTO
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({ ...errors, isValidationError: true });
      },
    })
  );

  app.useGlobalFilters(
    new AllExceptionFilter(),
    new ThrottlerExceptionFilter(),
    new ValidationExceptionFilter()
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  // By default, Fastify only listens localhost, so we should to specify '0.0.0.0'
  app.listen(process.env.PORT, '0.0.0.0');
})();
