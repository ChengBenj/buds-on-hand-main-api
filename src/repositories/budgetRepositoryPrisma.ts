import { Injectable } from '@nestjs/common';
import { Budget, BudgetState } from '@prisma/client';
import { ListUserBudgetFilter } from 'domain/budget/dtos/ListUserBudgetsBody';
import { PrismaService } from 'services/database/prisma.service';

import BudgetRepository from './budgetRepository';

@Injectable()
export default class BudgetRepositoryPrisma implements BudgetRepository {
  constructor(private prisma: PrismaService) {}

  async createBudget(payload: Budget): Promise<Budget> {
    return await this.prisma.budget.create({
      data: payload,
    });
  }

  async getUserBudgetById(id: string, ownerId: string): Promise<Budget> {
    return this.prisma.budget.findFirst({
      where: {
        id,
        owner_id: ownerId,
      },
    });
  }

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

  async deleteBudget(id: string): Promise<void> {
    await this.prisma.budget.delete({
      where: {
        id,
      },
    });
  }
}
