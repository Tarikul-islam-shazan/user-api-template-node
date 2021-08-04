require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT;

    await app.listen(port);

    console.log(`The server is running on Port: ${process.env.PORT}`);
  } catch (err) {
    throw err;
  }
}

bootstrap();
