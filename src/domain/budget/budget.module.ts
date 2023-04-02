import { Module } from '@nestjs/common';

import BudgetRepository from 'repositories/budgetRepository';
import BudgetRepositoryPrisma from 'repositories/budgetRepositoryPrisma';

import { PrismaService } from 'services/database/prisma.service';

import BudgetController from './budget.controller';

import CreateBudgetUseCase from './useCases/CreateBudget';
import DeleteBudgetUseCase from './useCases/DeleteBudget';
import GetBudgetUseCase from './useCases/GetBudget';
import ListBudgetsUseCase from './useCases/ListBudgets';

@Module({
  controllers: [BudgetController],
  providers: [
    PrismaService,
    ListBudgetsUseCase,
    GetBudgetUseCase,
    CreateBudgetUseCase,
    DeleteBudgetUseCase,
    {
      provide: BudgetRepository,
      useClass: BudgetRepositoryPrisma,
    },
  ],
})
export class BudgetModule {}
