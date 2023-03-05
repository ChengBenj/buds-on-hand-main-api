import { z } from 'zod';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import HashingService from 'services/hashing/hashing.service';

import UserRepository from 'repositories/userRepository';

import { LoginUserBody } from '../dtos/LoginUserBody';

@Injectable()
export default class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashingService: HashingService,
    private jwtService: JwtService,
  ) {}

  async execute(body: LoginUserBody) {
    await this.validate(body);

    const user = await this.userRepository.findByEmail(body.email);

    if (!user) throw new NotFoundException('There is no user this email!');

    if (!(await this.hashingService.verify(body.password, user.password)))
      throw new UnauthorizedException("The email or password doesn't match");

    delete user.password;

    const token = this.jwtService.sign(user);

    return token;
  }

  private async validate(body: LoginUserBody) {
    const userSchema = z
      .object({
        email: z
          .string({
            required_error: 'Email is required',
          })
          .email({ message: 'Invalid email address' }),
        password: z
          .string({
            required_error: 'Password is required',
          })
          .min(8, 'Password too short')
          .max(16, 'Password too large'),
      })
      .required();

    await userSchema.parseAsync(body);
  }
}
