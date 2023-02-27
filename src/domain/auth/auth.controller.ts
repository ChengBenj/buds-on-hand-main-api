import { Body, Controller, Post } from '@nestjs/common';

import { RegisterUserBody } from './dtos/RegisterUserBody';

import RegisterUserUseCase from './useCases/RegisterUser';

@Controller('auth')
export class AuthController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}

  @Post('register')
  async register(@Body() body: RegisterUserBody): Promise<unknown> {
    await this.registerUserUseCase.execute(body);

    return { message: 'Registered' };
  }
}
