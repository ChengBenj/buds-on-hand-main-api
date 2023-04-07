import { randomUUID } from 'crypto';
import { RegisterUserBody } from 'domain/auth/dtos/RegisterUserBody';
import RegisterUserUseCase from 'domain/auth/useCases/RegisterUser';

import UserRepository from 'repositories/userRepository';
import UserRepositoryPrisma from 'repositories/userRepositoryPrisma';

import { PrismaService } from 'services/database/prisma.service';
import HashingBcryptService from 'services/hashing/bcrypt.service';
import HashingService from 'services/hashing/hashing.service';

describe('Register User', () => {
  let prismaService: PrismaService;
  let hashingService: HashingService;

  let userRepository: UserRepository;

  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(async () => {
    prismaService = new PrismaService();
    hashingService = new HashingBcryptService();

    userRepository = new UserRepositoryPrisma(prismaService);

    registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      hashingService,
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('Should register user and send register verify email', async () => {
    const body: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockImplementation(async () => undefined);

    const createFn = jest
      .spyOn(userRepository, 'create')
      .mockImplementation(() => undefined);

    await registerUserUseCase.execute(body);

    expect(createFn).toHaveBeenCalled();
  });

  it('Should throw error when given a duplicate email', async () => {
    const body: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    const duplicatedUserBody: RegisterUserBody = {
      name: 'Benjamin Cheng 2',
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockImplementationOnce(async () => undefined);

    jest.spyOn(userRepository, 'create').mockImplementation(() => undefined);

    await registerUserUseCase.execute(body);

    jest
      .spyOn(userRepository, 'findByEmail')
      .mockImplementationOnce(async () => ({
        id: randomUUID(),
        name: 'Benjamin Cheng',
        email: 'benjaminscalabrin@gmail.com',
        password: '12345678',
      }));

    expect(() =>
      registerUserUseCase.execute(duplicatedUserBody),
    ).rejects.toThrow('This email address is already register');
  });

  it('Should throw error when email is not valid', () => {
    const body: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: 'benjaminscalabrin@',
      password: '12345678',
    };

    expect(() => registerUserUseCase.execute(body)).rejects.toThrow(
      'Invalid email address',
    );
  });

  it('Should throw error when send empty fields', () => {
    const noNameBody: RegisterUserBody = {
      name: undefined,
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    const noEmailBody: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: undefined,
      password: '12345678',
    };

    const noPasswordBody: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: 'benjaminscalabrin@gmail.com',
      password: undefined,
    };

    expect(() => registerUserUseCase.execute(noNameBody)).rejects.toThrow(
      'Name is required',
    );

    expect(() => registerUserUseCase.execute(noEmailBody)).rejects.toThrow(
      'Email is required',
    );

    expect(() => registerUserUseCase.execute(noPasswordBody)).rejects.toThrow(
      'Password is required',
    );
  });

  it('Should throw error when send empty fields', () => {
    const shortPasswordBody: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: 'benjaminscalabrin@gmail.com',
      password: '123',
    };

    expect(() =>
      registerUserUseCase.execute(shortPasswordBody),
    ).rejects.toThrow('Password too short');

    const largePasswordBody: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678910123123123',
    };

    expect(() =>
      registerUserUseCase.execute(largePasswordBody),
    ).rejects.toThrow('Password too large');
  });
});
