import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionFilter } from './filter/all-exception.filter';
import { AppConfig } from '@/app.config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { Module } from '@nestjs/common';
import { ThrottlerExceptionFilter } from './filter/throttler-exception.filter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationExceptionFilter } from './filter/validator-exception.filter';

@Module({
  imports: [
    // Allow to access .env file and validate env variable
    ConfigModule.forRoot(AppConfig.getInitConifg()),
    // Internationalization and localization
    I18nModule.forRoot(AppConfig.getI18nConfig()),
    // Protect application from brute-force attacks
    ThrottlerModule.forRoot(AppConfig.getThrottlerConfig()),
    // Database
    TypeOrmModule.forRoot(AppConfig.getTypeOrmConfig()),
    // App
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_FILTER, useClass: ThrottlerExceptionFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
