import { Module } from '@nestjs/common';
import BudgetRepository from 'repositories/budgetRepository';
import BudgetRepositoryPrisma from 'repositories/budgetRepositoryPrisma';
import { PrismaService } from 'services/database/prisma.service';
import BudgetController from './budget.controller';
import ListBudgetsUseCase from './useCases/ListBudgets';

@Module({
  controllers: [BudgetController],
  providers: [
    PrismaService,
    ListBudgetsUseCase,
    {
      provide: BudgetRepository,
      useClass: BudgetRepositoryPrisma,
    },
  ],
})
export class BudgetModule {}