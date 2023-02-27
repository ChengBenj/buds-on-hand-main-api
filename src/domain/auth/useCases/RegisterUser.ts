import { z } from 'zod';
import { Injectable } from '@nestjs/common';
import { RegisterUserBody } from '../dtos/RegisterUserBody';
import UserRepository from '../repositories/userRepository';

@Injectable()
export default class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(body: RegisterUserBody) {
    const userSchema = z
      .object({
        email: z
          .string({
            required_error: 'Email is required',
          })
          .email({ message: 'Invalid email address' }),
        name: z.string({
          required_error: 'Name is required',
        }),
        password: z
          .string({
            required_error: 'Password is required',
          })
          .min(8, 'Password too short')
          .max(16, 'Password too large'),
      })
      .required();

    await userSchema.parseAsync(body);

    const user = await this.userRepository.findByEmail(body.email);

    if (!!user) throw new Error('This email address is already register');

    await this.userRepository.create(body.name, body.email, body.password);
  }
}
