import { BadRequestException, Injectable } from '@nestjs/common';
import { BudgetState, User } from '@prisma/client';
import { isValid, parse } from 'date-fns';
import BudgetRepository from 'repositories/budgetRepository';
import { ListUserBudgetFilter } from '../dtos/ListUserBudgetsBody';

@Injectable()
export default class ListBudgetsUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(user: User, filters?: ListUserBudgetFilter) {
    this.validate(filters);

    const budgets = await this.budgetRepository.listByUser(user.id, filters);

    return budgets;
  }

  private validate(filters?: ListUserBudgetFilter) {
    if (!filters) return true;

    if (filters.state && !filters.state.every((state) => state in BudgetState))
      throw new BadRequestException('There is some unavailble states');

    if (!filters.startDate !== !filters.endDate)
      throw new BadRequestException(
        'Should sent start and end date to filter between dates',
      );

    if (
      filters.startDate &&
      !isValid(parse(filters.startDate, 'yyyy-MM-dd', new Date()))
    )
      throw new BadRequestException('Start date should be a valid date');

    if (
      filters.endDate &&
      !isValid(parse(filters.endDate, 'yyyy-MM-dd', new Date()))
    )
      throw new BadRequestException('End date should be a valid date');
  }
}
