import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { User } from 'src/decorators/User';
import { ListUserBudgetsQuery } from './dtos/ListUserBudgetsBody';
import CreateBudgetUseCase from './useCases/CreateBudget';
import DeleteBudgetUseCase from './useCases/DeleteBudget';
import GetBudgetUseCase from './useCases/GetBudget';
import ListBudgetsUseCase from './useCases/ListBudgets';

@Controller('budget')
export default class BudgetController {
  constructor(
    private listBudgetsUseCase: ListBudgetsUseCase,
    private getBudgetUseCase: GetBudgetUseCase,
    private createBudgetUseCase: CreateBudgetUseCase,
    private deleteBudgetUseCase: DeleteBudgetUseCase,
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
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() body, @User() user) {
    const budget = await this.createBudgetUseCase.execute(body, user);

    return {
      message: 'Budget created successfully',
      data: {
        budget,
      },
    };
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  public async delete(@Param('id') id: string, @User() user) {
    await this.deleteBudgetUseCase.execute(id, user);

    return {
      message: 'Budget has been deleted successfully',
    };
  }
}
