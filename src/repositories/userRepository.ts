import { User } from '@prisma/client';

export default abstract class UserRepository {
  abstract create(name: string, email: string, password: string): Promise<void>;

  abstract findByEmail(email: string): Promise<User>;
}
