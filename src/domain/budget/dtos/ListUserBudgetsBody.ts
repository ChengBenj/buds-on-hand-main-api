import { BudgetState } from '@prisma/client';

export class ListUserBudgetFilter {
  state?: Array<BudgetState>;
  startDate?: string;
  endDate?: string;
  type?: BudgetState;
}

export class ListUserBudgetsQuery extends ListUserBudgetFilter {}
