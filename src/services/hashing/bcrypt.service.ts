import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import HashingService from './hashing.service';

@Injectable()
export default class HashingBcryptService implements HashingService {
  async hash(password) {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  async verify(password, hash) {
    return bcrypt.compare(password, hash);
  }
}
