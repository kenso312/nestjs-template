import { APP_GUARD } from '@nestjs/core';
import { AppConfig } from '@/app.config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
