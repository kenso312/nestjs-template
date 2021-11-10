import { AppModule } from '@/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { I18nService } from 'nestjs-i18n';
import { NestFactory } from '@nestjs/core';
import { ResponseInterceptor } from '@/interceptor/response.interceptor';
import { Transport } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';

(async () => {
  const fastifyAdapter = new FastifyAdapter({
    logger: process.env.LOGGING === 'true',
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter
  );

  app.connectMicroservice({
    options: {
      transport: Transport.RMQ,
      urls: [process.env.MQ_HOST],
      queue: 'payment_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  // Since NestJS filter cannot catch JSON parse error in request body [Fastify layer catch this error]
  // but Fastify's error response format do not match our format here because
  // so we have to do extra step here to sync error response format
  const i18n = app.get<I18nService>(I18nService);
  fastifyAdapter.setErrorHandler(async (error, _request, reply) => {
    reply.send({
      error:
        error instanceof SyntaxError
          ? { message: await i18n.t('app.error_msg.json_parse'), code: -10000 }
          : { message: await i18n.t('app.error_msg.unexcepted'), code: -10001 },
    });
  });

  app.setGlobalPrefix('api');

  // https://docs.nestjs.com/techniques/versioning#versioning
  app.enableVersioning();

  // Allowing to do validation through DTO
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({ ...errors, isValidationError: true });
      },
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  // By default, Fastify only listens localhost, so we should to specify '0.0.0.0'
  app.listen(process.env.PORT, '0.0.0.0');
})();
