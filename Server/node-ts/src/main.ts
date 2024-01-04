import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // const config = new DocumentBuilder()
  //   .setTitle('Location')
  //   .setDescription('cool locations for your pictures!!!')
  //   .setVersion('1.0')
  //   .addTag('locations')
  //   .build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('location', app, document);
  const port = 8080;
  await app.listen(port);
  console.log(`application listening in port ${port}`);
}
bootstrap();