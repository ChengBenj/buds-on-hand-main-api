import { Controller, Get, Query } from '@nestjs/common';
import { User } from 'src/decorators/User';
import { ListUserBudgetsQuery } from './dtos/ListUserBudgetsBody';
import ListBudgetsUseCase from './useCases/ListBudgets';

@Controller('budget')
export default class BudgetController {
  constructor(private listBudgetsUseCase: ListBudgetsUseCase) {}

  @Get('/')
  public async list(@Query() query: ListUserBudgetsQuery, @User() user) {
    const budgets = await this.listBudgetsUseCase.execute(user, query);

    return {
      message: 'Budgets load successfully',
      data: { budgets },
    };
  }
}
