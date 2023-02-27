import RegisterUserUseCase from '../src/domain/auth/useCases/RegisterUser';

import UserRepositoryMemory from '../src/domain/auth/repositories/userRepositoryMemory';

import { RegisterUserBody } from '../src/domain/auth/dtos/RegisterUserBody';

describe('Register User', () => {
  it('Should register user and send register verify email', async () => {
    const userRepository = new UserRepositoryMemory();
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

    const body: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    await registerUserUseCase.execute(body);
  });

  it('Should throw error when given a duplicate email', async () => {
    const userRepository = new UserRepositoryMemory();
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

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

    await registerUserUseCase.execute(body);

    expect(() =>
      registerUserUseCase.execute(duplicatedUserBody),
    ).rejects.toThrow('This email address is already register');
  });

  it('Should throw error when email is not valid', () => {
    const userRepository = new UserRepositoryMemory();
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

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
    const userRepository = new UserRepositoryMemory();
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

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
    const userRepository = new UserRepositoryMemory();
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

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
