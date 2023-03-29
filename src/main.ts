import { NestFactory } from '@nestjs/core';

import HttpInterceptorService from 'services/http/http-interceptor.service';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new HttpInterceptorService());

  await app.listen(8567);
}
bootstrap();
