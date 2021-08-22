require('dotenv').config();

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = new ConfigService();
    const port = configService.get('APP_PORT');
    const logger = new Logger();

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
      .setTitle('Users Management')
      .setDescription('The Users API description')
      .setVersion('1.0')
      .addTag('users')
      .addBearerAuth()
      .build();

    const options: SwaggerDocumentOptions = {
      operationIdFactory: (_controllerKey: string, methodKey: string) =>
        methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(port);

    logger.log(
      `"L:40", "/src/main.ts", The server is running on Port: ${port}`,
    );
  } catch (err) {
    this.logger.error(
      `"L:42", "/src/main.ts", The server could not be loaded!`,
      err.stack,
    );
    throw new Error('Internal Server Error');
  }
}

bootstrap();
