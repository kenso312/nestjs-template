import * as Joi from 'joi';
import * as path from 'path';
import { ConfigModuleOptions } from '@nestjs/config';
import { HeaderResolver, I18nJsonParser, I18nOptions } from 'nestjs-i18n';
import { NodeEnv } from '@/utils/enums/_index';
import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class AppConfig {
  public static getInitConifg(): ConfigModuleOptions {
    const validDBTypes = [
      'mysql',
      'mariadb',
      'postgres',
      'cockroachdb',
      'sqlite',
      'mssql',
      'sap',
      'oracle',
      'cordova',
      'nativescript',
      'react-native',
      'sqljs',
      'mongodb',
      'aurora-data-api',
      'aurora-data-api-pg',
      'expo',
      'better-sqlite3',
      'capacitor',
    ];
    const validNodeEnvList = Object.keys(NodeEnv).map((key) => NodeEnv[key]);

    return {
      validationSchema: Joi.object({
        PORT: Joi.number().min(1).max(65535).default(3000),
        LOGGING: Joi.boolean().default(true),
        DB_TYPE: Joi.string().valid(...validDBTypes),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number().min(1).max(65535),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        FRONTEND_URL: Joi.string().uri(),
        NODE_ENV: Joi.string().valid(...validNodeEnvList),
      }),
      validationOptions: {
        // allowUnknown: false,
      },
    };
  }

  public static getI18nConfig(): I18nOptions {
    return {
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '..', 'i18n'),
        watch: true,
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
      logging: process.env.LOGGING === 'true',
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
