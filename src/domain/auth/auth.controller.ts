import { Body, Controller, Post } from '@nestjs/common';

import { RegisterUserBody } from './dtos/RegisterUserBody';
import { LoginUserBody } from './dtos/LoginUserBody';

import RegisterUserUseCase from './useCases/RegisterUser';
import LoginUserUseCase from './useCases/LoginUser';

@Controller('auth')
export class AuthController {
  constructor(
    private registerUserUseCase: RegisterUserUseCase,
    private loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterUserBody): Promise<unknown> {
    await this.registerUserUseCase.execute(body);

    return { message: 'Registered' };
  }

  @Post('login')
  async login(@Body() body: LoginUserBody): Promise<unknown> {
    const token = await this.loginUserUseCase.execute(body);

    return {
      message: 'Login successfully',
      data: {
        token,
      },
    };
  }
}
