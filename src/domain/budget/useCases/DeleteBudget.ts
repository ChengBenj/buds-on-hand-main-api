import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import BudgetRepository from 'repositories/budgetRepository';

@Injectable()
export default class DeleteBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(id: string, user: User): Promise<void> {
    const budget = await this.budgetRepository.getUserBudgetById(id, user.id);

    if (!budget) throw new NotFoundException('Budget not found');

    await this.budgetRepository.deleteBudget(id);

    return;
  }
}
