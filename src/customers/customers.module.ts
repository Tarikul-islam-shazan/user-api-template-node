import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './controllers/customers.controller';
import { CustomersRepository } from './repositories/customers.repository';
import { CustomersService } from './services/customers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomersRepository]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('FILE_PATH'),
      }),
    }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
