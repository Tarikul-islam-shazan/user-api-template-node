import { ConnectionOptions } from "typeorm";
import { config as loadEnv } from "dotenv";
import { join } from 'path';

loadEnv();

type ConfigPerEnv = {
  [env in 'production' | 'development' | 'test']: Partial<ConnectionOptions>;
};

const eachEnvConfig: ConfigPerEnv = {
  production: {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },
  development: {
    type: 'mongodb',
    // host: process.env.DB_HOST,
    // database: process.env.DB_NAME,
    // Added url option and made 2 lines above obsolete as they are not working
    url: process.env.DB_URL,
    port: parseInt(process.env.DB_PORT)
  },
  test: {
    type: 'sqlite',
    database: process.env.DATABASE_NAME
  }
}

const commonConfig: Partial<ConnectionOptions> = {
  synchronize: true,
  migrationsTableName: 'db_migrations',
  migrationsRun: false,
  migrations: [join(__dirname, '..', 'migrations/**/*{.ts,.js}')],
  entities: [join(__dirname, '**/*.entity{.ts,.js}')],
  cli: {
    migrationsDir: './migrations',
  }
}

const config: Partial<ConnectionOptions> = {
  ...eachEnvConfig[process.env.NODE_ENV || 'development'],
  ...commonConfig
}

export = config;
