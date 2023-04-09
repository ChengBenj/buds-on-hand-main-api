import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from 'services/database/prisma.service';

export default () => mockDeep<PrismaService>() as any as PrismaService;
