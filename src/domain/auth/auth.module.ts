import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from 'src/services/database/prisma.service';
import HashingService from 'src/services/hashing/hashing.service';
import HashingBcryptService from 'src/services/hashing/bcrypt.service';

import UserRepositoryPrisma from 'repositories/userRepositoryPrisma';
import UserRepository from 'repositories/userRepository';

import { AuthController } from './auth.controller';

import RegisterUserUseCase from './useCases/RegisterUser';
import LoginUserUseCase from './useCases/LoginUser';

@Module({
  imports: [
    JwtModule.register({
      secret: 'buds',
      signOptions: {
        expiresIn: '1 day',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    RegisterUserUseCase,
    LoginUserUseCase,
    {
      provide: UserRepository,
      useClass: UserRepositoryPrisma,
    },
    {
      provide: HashingService,
      useClass: HashingBcryptService,
    },
  ],
})
export class AuthModule {}
