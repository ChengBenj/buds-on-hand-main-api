import { Module } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';

import { AuthController } from './auth.controller';

import RegisterUserUseCase from './useCases/RegisterUser';

import UserRepositoryPrisma from './repositories/userRepositoryPrisma';
import UserRepository from './repositories/userRepository';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    PrismaService,
    RegisterUserUseCase,
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
  ],
})
export class AuthModule {}
