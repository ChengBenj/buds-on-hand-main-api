import { Injectable } from '@nestjs/common';
import { Budget, BudgetState } from '@prisma/client';
import { ListUserBudgetFilter } from 'domain/budget/dtos/ListUserBudgetsBody';
import { PrismaService } from 'services/database/prisma.service';

import BudgetRepository from './budgetRepository';

@Injectable()
export default class BudgetRepositoryPrisma implements BudgetRepository {
  constructor(private prisma: PrismaService) {}

  async listByUser(
    userId: string,
    filters?: ListUserBudgetFilter,
  ): Promise<Array<Budget>> {
    const columnDates: Record<BudgetState, string> = {
      PLANNING: 'createdAt',
      DOING: 'startAt',
      DONE: 'doneAt',
    };

    const stateWhere = {
      state: {
        in: filters.state,
      },
    };

    const dateWhere = {
      [columnDates[filters.type || BudgetState.PLANNING]]: {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      },
    };

    const budgets = this.prisma.budget.findMany({
      where: {
        owner_id: userId,
        ...(filters.state ? stateWhere : {}),
        ...(filters.startDate ? dateWhere : {}),
      },
    });

    return budgets;
  }
}