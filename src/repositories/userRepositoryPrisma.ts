import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from 'services/database/prisma.service';

import UserRepository from './userRepository';

@Injectable()
export default class UserRepositoryPrisma implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(name: string, email: string, password: string) {
    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }
}
