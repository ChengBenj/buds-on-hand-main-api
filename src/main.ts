import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ErrorHandleingInterceptor from './infra/http/ErrorHandleingInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ErrorHandleingInterceptor());

  await app.listen(3000);
}
bootstrap();
