import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/User';
import { ListUserBudgetsQuery } from './dtos/ListUserBudgetsBody';
import CreateBudgetUseCase from './useCases/CreateBudget';
import ListBudgetsUseCase from './useCases/ListBudgets';

@Controller('budget')
export default class BudgetController {
  constructor(
    private listBudgetsUseCase: ListBudgetsUseCase,
    private createBudgetUseCase: CreateBudgetUseCase,
  ) {}

  @Get('/')
  public async list(@Query() query: ListUserBudgetsQuery, @User() user) {
    const budgets = await this.listBudgetsUseCase.execute(user, query);

    return {
      message: 'Budgets load successfully',
      data: { budgets },
    };
  }

  @Post('/')
  public async create(@Body() body, @User() user) {
    const budget = await this.createBudgetUseCase.execute(body, user);

    return {
      message: 'Budget created successfully',
      data: {
        budget,
      },
    };
  }
}
