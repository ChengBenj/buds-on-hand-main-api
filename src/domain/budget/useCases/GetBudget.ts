import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import BudgetRepository from 'repositories/budgetRepository';

@Injectable()
export default class GetBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(id: string, user: User) {
    const budget = await this.budgetRepository.getUserBudgetById(id, user.id);

    if (!budget) throw new NotFoundException('No budget was found');

    return budget;
  }
}
