import * as path from 'path';
import { HeaderResolver, I18nJsonParser, I18nOptions } from 'nestjs-i18n';
import { NodeEnv } from '@/utils/enums/_index';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class AppConfig {
  public static getI18nConfig(): I18nOptions {
    return {
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
      resolvers: [{ use: HeaderResolver, options: ['lang', 'locale'] }],
    };
  }

  public static getThrottlerConfig(): ThrottlerModuleOptions {
    return {
      ttl: 60,
      limit: 5,
    };
  }

  public static getTypeOrmConfig(): TypeOrmModuleOptions {
    const entitiesDir = 'database/entities';
    const migrationsDir = 'database/migrations';
    const subscribersDir = 'database/subscribers';
    return {
      type: process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: process.env.DEBUG === 'true',
      // debug: process.env.DEBUG === 'true',
      synchronize: process.env.NODE_ENV === NodeEnv.LOCAL,
      entities: [`${__dirname}/${entitiesDir}/*.entity.{ts,js}`],
      migrations: [`${__dirname}/${migrationsDir}/*.migration.{ts,js}`],
      subscribers: [`${__dirname}/${subscribersDir}/*.subscriber.{ts,js}`],
      cli: {
        entitiesDir: `src/${entitiesDir}`,
        migrationsDir: `src/${migrationsDir}`,
        subscribersDir: `src/${subscribersDir}`,
      },
      extra: {
        // For SQL Server that has self signed certificate error, enable below setting
        // trustServerCertificate: true,
      },
    };
  }
}
