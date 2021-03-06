import { APP_GUARD } from '@nestjs/core';
import { AppConfig } from '@/app.config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Allow to access .env file
    ConfigModule.forRoot(),
    // Internationalization and localization
    I18nModule.forRoot(AppConfig.getI18nConfig()),
    // Protect application from brute-force attacks
    ThrottlerModule.forRoot(AppConfig.getThrottlerConfig()),
    // Database
    TypeOrmModule.forRoot(AppConfig.getTypeOrmConfig()),
    // App
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
