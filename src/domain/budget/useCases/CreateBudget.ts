import { Injectable } from '@nestjs/common';
import { Budget, BudgetState, User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as zod from 'zod';

import BudgetRepository from 'repositories/budgetRepository';

import { CreateBudgetBody } from '../dtos/CreateBudgetBody';

@Injectable()
export default class CreateBudgetUseCase {
  constructor(private budgetRepository: BudgetRepository) {}

  async execute(payload: CreateBudgetBody, user: User): Promise<Budget> {
    await this.validate(payload);

    const newBudget = this.make(payload, user);

    return await this.budgetRepository.createBudget(newBudget);
  }

  private make(payload: CreateBudgetBody, user: User): Budget {
    return {
      state: BudgetState.PLANNING,
      target: payload.target ? new Decimal(payload.target) : undefined,
      owner_id: user.id,
      id: undefined,
      createdAt: undefined,
      startAt: undefined,
      doneAt: undefined,
    };
  }

  private async validate(payload: CreateBudgetBody) {
    const budgetSchema = zod.object({
      target: zod
        .number({
          invalid_type_error: 'Target should be a number',
        })
        .gt(0, 'Target value should be higher than 0')
        .optional(),
    });

    await budgetSchema.parseAsync(payload);
  }
}
