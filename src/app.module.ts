import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configValidationSchema } from './config.schema';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    UsersModule,
    DatabaseModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        // host: configService.get('DB_HOST'),
        // database: configService.get('DB_NAME'),
        // Added url option and made 2 lines above obsolete as they are not working
        url: configService.get('DB_URL'),
        port: configService.get('DB_PORT'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CustomersModule,
  ],
})
export class AppModule {}
