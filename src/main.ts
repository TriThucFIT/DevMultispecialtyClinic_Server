import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getMetadataArgsStorage } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8000);
  const metadata = getMetadataArgsStorage().tables.map((tbl) => tbl.target);
  console.log(metadata);
}
bootstrap();
