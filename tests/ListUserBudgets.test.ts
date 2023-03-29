import { Budget, BudgetState, User } from '@prisma/client';

import { ListUserBudgetFilter } from 'domain/budget/dtos/ListUserBudgetsBody';
import ListBudgetsUseCase from 'domain/budget/useCases/ListBudgets';

import { PrismaService } from 'services/database/prisma.service';

import BudgetRepository from 'repositories/budgetRepository';
import BudgetRepositoryPrisma from 'repositories/budgetRepositoryPrisma';

describe('List User Budgets', () => {
  let listBudgetsUseCase: ListBudgetsUseCase;
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
    listBudgetsUseCase = new ListBudgetsUseCase(budgetRepository);
  });

  it('List all budgets from user', async () => {
    const result: Array<Budget> = [
      {
        id: '1',
        owner_id: '123',
        state: 'PLANNING',
        createdAt: new Date(2023, 2, 26),
        startAt: undefined,
        doneAt: undefined,
        target: undefined,
      },
      {
        id: '3',
        owner_id: '123',
        state: 'DONE',
        createdAt: new Date(2023, 2, 12),
        startAt: new Date(2023, 2, 16),
        doneAt: new Date(2023, 3, 4),
        target: undefined,
      },
      {
        id: '4',
        owner_id: '123',
        state: 'DOING',
        createdAt: new Date(2023, 3, 1),
        startAt: new Date(2023, 3, 15),
        doneAt: undefined,
        target: undefined,
      },
    ];

    jest
      .spyOn(budgetRepository, 'listByUser')
      .mockImplementation(async () => result);

    const budgets = await listBudgetsUseCase.execute(user);

    expect(budgets).toHaveLength(3);
  });

  it('List all budgets from user filtered by one state', async () => {
    const result: Array<Budget> = [
      {
        id: '1',
        owner_id: '123',
        state: 'PLANNING',
        createdAt: new Date(2023, 2, 26),
        startAt: undefined,
        doneAt: undefined,
        target: undefined,
      },
    ];

    jest
      .spyOn(budgetRepository, 'listByUser')
      .mockImplementation(async () => result);

    const filter: ListUserBudgetFilter = {
      state: [BudgetState.PLANNING],
    };

    expect(await listBudgetsUseCase.execute(user, filter)).toHaveLength(1);
  });

  it('List all budgets from user filtered by one states', async () => {
    const result: Array<Budget> = [
      {
        id: '1',
        owner_id: '123',
        state: 'PLANNING',
        createdAt: new Date(2023, 2, 26),
        startAt: undefined,
        doneAt: undefined,
        target: undefined,
      },
      {
        id: '2',
        owner_id: '123',
        state: 'DOING',
        createdAt: new Date(2023, 2, 26),
        startAt: new Date(2023, 3, 1),
        doneAt: undefined,
        target: undefined,
      },
    ];

    jest
      .spyOn(budgetRepository, 'listByUser')
      .mockImplementation(async () => result);

    const filters: ListUserBudgetFilter = {
      state: [BudgetState.PLANNING, BudgetState.DOING],
    };

    expect(await listBudgetsUseCase.execute(user, filters)).toHaveLength(2);
  });

  it('List all budgets from user filtered between dates', async () => {
    const result: Array<Budget> = [
      {
        id: '1',
        owner_id: '123',
        state: 'PLANNING',
        createdAt: new Date(2023, 2, 26),
        startAt: new Date(2023, 2, 29),
        doneAt: undefined,
        target: undefined,
      },
      {
        id: '2',
        owner_id: '123',
        state: 'DOING',
        createdAt: new Date(2023, 3, 1),
        startAt: new Date(2023, 3, 3),
        doneAt: undefined,
        target: undefined,
      },
    ];

    jest
      .spyOn(budgetRepository, 'listByUser')
      .mockImplementation(async () => result);

    const filters: ListUserBudgetFilter = {
      startDate: '2023-03-01',
      endDate: '2023-04-01',
      type: BudgetState.DOING,
    };

    expect(await listBudgetsUseCase.execute(user, filters)).toHaveLength(2);
  });

  it('List all budgets from user without budgets', async () => {
    const result: Array<Budget> = [];

    jest
      .spyOn(budgetRepository, 'listByUser')
      .mockImplementation(async () => result);

    expect(await listBudgetsUseCase.execute(user)).toHaveLength(0);
  });

  it('Should throw error when pass invalid data on filters', async () => {
    const filters1: ListUserBudgetFilter = {
      endDate: '2023-03-21',
    };
    const filters2: ListUserBudgetFilter = {
      endDate: '2023-03-03',
      startDate: '2023-03',
    };
    const filters3: ListUserBudgetFilter = {
      endDate: '2023',
      startDate: '2023-03-03',
    };

    expect(() =>
      listBudgetsUseCase.execute(user, filters1),
    ).rejects.toThrowError(
      'Should sent start and end date to filter between dates',
    );

    expect(() =>
      listBudgetsUseCase.execute(user, filters2),
    ).rejects.toThrowError('Start date should be a valid date');

    expect(() =>
      listBudgetsUseCase.execute(user, filters3),
    ).rejects.toThrowError('End date should be a valid date');
  });

  it('Should throw error when pass invalid state', () => {
    const filters: ListUserBudgetFilter = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Ignore to throw error
      state: ['TESTE', 'PLANNING'],
    };

    expect(() =>
      listBudgetsUseCase.execute(user, filters),
    ).rejects.toThrowError('There is some unavailble states');
  });
});
