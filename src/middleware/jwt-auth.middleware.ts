import {
  Injectable,
  UnauthorizedException,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import UserRepository from 'repositories/userRepository';

@Injectable()
export default class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  verifyToken(_token: string) {
    const token = _token?.replace('Bearer ', '');

    if (!token)
      throw new NotFoundException({
        message: 'Token not informed',
      });

    try {
      this.jwtService.verify(token, {
        secret: 'buds',
      });
    } catch (error) {
      return false;
    }

    return token;
  }

  async getUser(_token: string) {
    const tokenDecoded = this.jwtService.decode(_token) as Record<string, any>;

    const user = await this.userRepository.findByEmail(tokenDecoded.email);

    return user;
  }

  async use(req) {
    const token = this.verifyToken(req.headers?.authorization);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Token expiried',
      });
    }

    const user = await this.getUser(token);

    req.user = user;

    req.next();
  }
}
