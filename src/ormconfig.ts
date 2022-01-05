import { ConnectionOptions } from "typeorm";
import { config as loadEnv } from "dotenv";
import { join } from 'path';

loadEnv();

type ConfigPerEnv = {
  [env in 'production' | 'development' | 'test']: Partial<ConnectionOptions>;
};

const eachEnvConfig: ConfigPerEnv = {
  production: {
    type: 'postgres',
    host: process.env.POSTGRES_DB_HOST,
    port: parseInt(<string>process.env.POSTGRES_DB_PORT),
    username: process.env.POSTGRES_DB_USER,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB_NAME
  },
  development: {

    // this part for mongodb 
    type: 'mongodb',
    // host: process.env.DB_HOST,
    database: process.env.MONGO_DB_NAME,
    url: process.env.MONGO_DB_URL,
    port: parseInt(<string>process.env.MONGO_DB_PORT)
    

    // this part for mysql
    /*
    type: 'mysql',
    host: process.env.MYSQL_DB_HOST,
    port: parseInt(<string>process.env.MYSQL_DB_PORT),
    username: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME
    */

    //this part for postgres
    /*
    type: 'postgres',
    host: process.env.POSTGRES_DB_HOST,
    port: parseInt(<string>process.env.POSTGRES_DB_PORT),
    username: process.env.POSTGRES_DB_USER,
    password: process.env.POSTGRES_DB_PASSWORD,
    database: process.env.POSTGRES_DB_NAME
    */
  },
  test: {
    type: 'mysql',
    host: process.env.MYSQL_DB_HOST,
    port: parseInt(<string>process.env.MYSQL_DB_PORT),
    username: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME
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
