import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';

import prismaServiceMock from '@mocks/services/database/prisma.service';

import { LoginUserBody } from 'domain/auth/dtos/LoginUserBody';
import LoginUserUseCase from 'domain/auth/useCases/LoginUser';

import UserRepository from 'repositories/userRepository';
import UserRepositoryPrisma from 'repositories/userRepositoryPrisma';

import { PrismaService } from 'services/database/prisma.service';
import HashingBcryptService from 'services/hashing/bcrypt.service';
import HashingService from 'services/hashing/hashing.service';

describe('Login User', () => {
  let prismaService: PrismaService;
  let hashingService: HashingService;
  let jwtService: JwtService;

  let userRepository: UserRepository;

  let loginUserUseCase: LoginUserUseCase;

  beforeEach(async () => {
    prismaService = prismaServiceMock();
    hashingService = new HashingBcryptService();
    jwtService = new JwtService({
      secret: 'buds',
    });

    userRepository = new UserRepositoryPrisma(prismaService);

    loginUserUseCase = new LoginUserUseCase(
      userRepository,
      hashingService,
      jwtService,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('Should login user when pass a valid email and correct password', async () => {
    const hashPassword = await hashingService.hash('12345678');

    const user: User = {
      id: randomUUID(),
      email: 'benjaminscalabrin@gmail.com',
      name: 'Benjamin Cheng',
      password: hashPassword,
    };

    const body: LoginUserBody = {
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockImplementation(async () => user);

    const token = await loginUserUseCase.execute(body);

    const tokenDecoded = jwtService.decode(token) as Record<string, any>;

    expect(tokenDecoded.email).toEqual(body.email);
  });

  it('Should throw an error when user doesnt exists', async () => {
    const body: LoginUserBody = {
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockImplementation(() => undefined);

    expect(() => loginUserUseCase.execute(body)).rejects.toThrowError(
      'There is no user this email!',
    );
  });

  it('Should throw an error when password is incorrect', async () => {
    const hashPassword = await hashingService.hash('12345678');

    const user: User = {
      id: randomUUID(),
      email: 'benjaminscalabrin@gmail.com',
      name: 'Benjamin Cheng',
      password: hashPassword,
    };

    const body: LoginUserBody = {
      email: 'benjaminscalabrin@gmail.com',
      password: '123456789',
    };

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockImplementation(async () => user);

    expect(() => loginUserUseCase.execute(body)).rejects.toThrowError(
      "The email or password doesn't match",
    );
  });
});
