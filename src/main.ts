require('dotenv').config();

import { Logger, ValidationPipe } from '@nestjs/common';
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
    const port = process.env.PORT;

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
      .setTitle('Users Management')
      .setDescription('The Users API description')
      .setVersion('1.0')
      .addTag('users')
      .addBearerAuth()
      .build();

    const options: SwaggerDocumentOptions = {
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(port);

    const logger = new Logger();
    logger.log(`The server is running on Port: ${process.env.PORT}`);
  } catch (err) {
    throw err;
  }
}

bootstrap();
