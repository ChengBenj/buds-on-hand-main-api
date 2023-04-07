import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Budget, BudgetState, User } from '@prisma/client';

import BudgetRepository from 'repositories/budgetRepository';

@Injectable()
export default class UpdateBudgetStateUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(id: string, state: BudgetState, user: User): Promise<Budget> {
    const budget = await this.budgetRepository.getUserBudgetById(id, user.id);

    this.validate(state, budget);

    return await this.budgetRepository.updateBudget(id, {
      ...budget,
      state,
      startAt: state === BudgetState.DOING ? new Date() : undefined,
      doneAt: state === BudgetState.DONE ? new Date() : undefined,
    });
  }

  private validate(state: BudgetState, budget: Budget) {
    if (!(state in BudgetState))
      throw new BadRequestException(`This state does exists`);

    if (!budget) throw new NotFoundException('Budget not found');
  }
}
