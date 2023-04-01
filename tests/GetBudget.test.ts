import { Budget, User } from '@prisma/client';

import GetBudgetUseCase from 'domain/budget/useCases/GetBudget';

import BudgetRepository from 'repositories/budgetRepository';
import BudgetRepositoryPrisma from 'repositories/budgetRepositoryPrisma';

import { PrismaService } from 'services/database/prisma.service';

describe('Get budget', () => {
  let getBudgetUseCase: GetBudgetUseCase;
  let budgetRepository: BudgetRepository;
  let prismaService: PrismaService;

  const user: User = {
    id: '123',
    email: '',
    name: '',
    password: '',
  };

  beforeEach(async () => {
    prismaService = new PrismaService();
    budgetRepository = new BudgetRepositoryPrisma(prismaService);
    getBudgetUseCase = new GetBudgetUseCase(budgetRepository);
  });

  it('Get user budget by id', async () => {
    const budgetMock: Budget = {
      id: '2',
      owner_id: user.id,
      state: 'DOING',
      createdAt: new Date(2023, 2, 26),
      startAt: new Date(2023, 3, 1),
      doneAt: undefined,
      target: undefined,
    };

    jest
      .spyOn(budgetRepository, 'getUserBudgetById')
      .mockImplementation(async () => budgetMock);

    const budget = await getBudgetUseCase.execute('2', user);

    expect(budget).toEqual(budgetMock);
    expect(budget.owner_id).toEqual(user.id);
  });

  it('Should throw and error when tries to get budget from another user', async () => {
    jest
      .spyOn(budgetRepository, 'getUserBudgetById')
      .mockImplementation(async () => null);

    const anotherUser = {
      ...user,
      id: '321',
    };

    expect(() => getBudgetUseCase.execute('1', anotherUser)).rejects.toThrow(
      'No budget was found',
    );
  });

  it('Should throw error when budget doesnt exists', async () => {
    jest
      .spyOn(budgetRepository, 'getUserBudgetById')
      .mockImplementation(async () => null);

    expect(() => getBudgetUseCase.execute('1', user)).rejects.toThrow(
      'No budget was found',
    );
  });
});
