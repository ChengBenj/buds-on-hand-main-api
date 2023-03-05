import { MiddlewareConsumer, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule } from './domain/auth/auth.module';

import JwtAuthMiddleware from './middleware/jwt-auth.middleware';

import UserRepository from './repositories/userRepository';
import UserRepositoryPrisma from './repositories/userRepositoryPrisma';
import { PrismaService } from 'services/database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [
    JwtService,
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    PrismaService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtAuthMiddleware).exclude('auth/(.*)').forRoutes('*');
  }
}
