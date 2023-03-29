import { Budget } from '@prisma/client';
import { ListUserBudgetFilter } from 'domain/budget/dtos/ListUserBudgetsBody';

export default abstract class BudgetRepository {
  abstract listByUser(
    userId: string,
    filters?: ListUserBudgetFilter,
  ): Promise<Array<Budget>>;
}
