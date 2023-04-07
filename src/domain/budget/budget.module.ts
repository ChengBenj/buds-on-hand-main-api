import { Module } from '@nestjs/common';

import BudgetRepository from 'repositories/budgetRepository';
import BudgetRepositoryPrisma from 'repositories/budgetRepositoryPrisma';

import { PrismaService } from 'services/database/prisma.service';

import BudgetController from './budget.controller';

import ListBudgetsUseCase from './useCases/ListBudgets';
import GetBudgetUseCase from './useCases/GetBudget';
import CreateBudgetUseCase from './useCases/CreateBudget';
import UpdateBudgetStateUseCase from './useCases/UpdateBudgetState';
import DeleteBudgetUseCase from './useCases/DeleteBudget';

@Module({
  controllers: [BudgetController],
  providers: [
    PrismaService,
    ListBudgetsUseCase,
    GetBudgetUseCase,
    CreateBudgetUseCase,
    UpdateBudgetStateUseCase,
    DeleteBudgetUseCase,
    {
      provide: BudgetRepository,
      useClass: BudgetRepositoryPrisma,
    },
  ],
})
export class BudgetModule {}
