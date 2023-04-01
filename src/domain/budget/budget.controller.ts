import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/User';
import { ListUserBudgetsQuery } from './dtos/ListUserBudgetsBody';
import CreateBudgetUseCase from './useCases/CreateBudget';
import GetBudgetUseCase from './useCases/GetBudget';
import ListBudgetsUseCase from './useCases/ListBudgets';

@Controller('budget')
export default class BudgetController {
  constructor(
    private listBudgetsUseCase: ListBudgetsUseCase,
    private getBudgetUseCase: GetBudgetUseCase,
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

  @Get('/:id')
  public async get(@Param('id') id: string, @User() user) {
    const budget = await this.getBudgetUseCase.execute(id, user);

    return {
      message: 'Budget load successfully',
      data: { budget },
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
