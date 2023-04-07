import { Budget } from '@prisma/client';
import { ListUserBudgetFilter } from 'domain/budget/dtos/ListUserBudgetsBody';

export default abstract class BudgetRepository {
  abstract createBudget(payload: Budget): Promise<Budget>;

  abstract getUserBudgetById(id: string, ownerId: string): Promise<Budget>;

  abstract listByUser(
    userId: string,
    filters?: ListUserBudgetFilter,
  ): Promise<Array<Budget>>;

  abstract updateBudget(id: string, payload: Partial<Budget>): Promise<Budget>;

  abstract deleteBudget(id: string): Promise<void>;
}
