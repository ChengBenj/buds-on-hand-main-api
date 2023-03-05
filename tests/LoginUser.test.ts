import { JwtService } from '@nestjs/jwt';

import { LoginUserBody } from 'domain/auth/dtos/LoginUserBody';
import { RegisterUserBody } from 'domain/auth/dtos/RegisterUserBody';
import LoginUserUseCase from 'domain/auth/useCases/LoginUser';
import RegisterUserUseCase from 'domain/auth/useCases/RegisterUser';

import UserRepositoryMemory from 'repositories/userRepositoryMemory';

import HashingBcryptService from 'services/hashing/bcrypt.service';

describe('Login User', () => {
  it('Should login user when pass a valid email and correct password', async () => {
    const userRepository = new UserRepositoryMemory();
    const hashingBcryptService = new HashingBcryptService();
    const jwtService = new JwtService({
      secret: 'buds',
    });

    const registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      hashingBcryptService,
    );

    const registerBody: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    await registerUserUseCase.execute(registerBody);

    const loginUserUseCase = new LoginUserUseCase(
      userRepository,
      hashingBcryptService,
      jwtService,
    );
    const body: LoginUserBody = {
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    const token = await loginUserUseCase.execute(body);

    const tokenDecoded = jwtService.decode(token) as Record<string, any>;

    expect(tokenDecoded.email).toEqual(body.email);
  });

  it('Should throw an error when user doesnt exists', async () => {
    const userRepository = new UserRepositoryMemory();
    const hashingBcryptService = new HashingBcryptService();
    const jwtService = new JwtService({
      secret: 'buds',
    });

    const loginUserUseCase = new LoginUserUseCase(
      userRepository,
      hashingBcryptService,
      jwtService,
    );

    const body: LoginUserBody = {
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    expect(() => loginUserUseCase.execute(body)).rejects.toThrowError(
      'There is no user this email!',
    );
  });

  it('Should throw an error when password is incorrect', async () => {
    const userRepository = new UserRepositoryMemory();
    const hashingBcryptService = new HashingBcryptService();
    const jwtService = new JwtService({
      secret: 'buds',
    });

    const registerUserUseCase = new RegisterUserUseCase(
      userRepository,
      hashingBcryptService,
    );

    const registerBody: RegisterUserBody = {
      name: 'Benjamin Cheng',
      email: 'benjaminscalabrin@gmail.com',
      password: '12345678',
    };

    await registerUserUseCase.execute(registerBody);

    const loginUserUseCase = new LoginUserUseCase(
      userRepository,
      hashingBcryptService,
      jwtService,
    );

    const body: LoginUserBody = {
      email: 'benjaminscalabrin@gmail.com',
      password: 'abcdefgh',
    };

    expect(() => loginUserUseCase.execute(body)).rejects.toThrowError(
      "The email or password doesn't match",
    );
  });
});
