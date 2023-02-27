import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import UserRepository from './userRepository';

@Injectable()
export default class UserRepositoryMemory implements UserRepository {
  users = [];

  async create(name: string, email: string, password: string) {
    const user = {
      name,
      email,
      password,
    };

    this.users.push(user);

    return Promise.resolve(undefined);
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);

    return Promise.resolve(user);
  }
}
