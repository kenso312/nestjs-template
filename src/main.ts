import { AppModule } from '@/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { I18nService } from 'nestjs-i18n';
import { NestFactory } from '@nestjs/core';
import { ResponseInterceptor } from '@/interceptor/response.interceptor';
import { Transport } from '@nestjs/microservices';
import { ValidationError } from 'class-validator';
import { ValidationException } from './exception/validation-exception';
import { ValidationPipe } from '@nestjs/common';

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
  // but Fastify's error response format do not match our format here
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

  app.enableCors();

  // Allowing to do validation through DTO
  // Since class-validator library will only throw BadRequestException, which is hard to recognize
  // by filter, so we create a ValidationException and replace BadRequestException using exceptionFactory
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        return new ValidationException(Object.values(errors[0].constraints));
      },
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  // By default, Fastify only listens localhost, so we should to specify '0.0.0.0'
  app.listen(process.env.PORT, '0.0.0.0');
})();
