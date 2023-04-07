import { randomUUID } from 'node:crypto';
import { BudgetState, User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

import { CreateBudgetBody } from 'domain/budget/dtos/CreateBudgetBody';
import CreateBudgetUseCase from 'domain/budget/useCases/CreateBudget';

import BudgetRepository from 'repositories/budgetRepository';
import BudgetRepositoryPrisma from 'repositories/budgetRepositoryPrisma';

import { PrismaService } from 'services/database/prisma.service';

describe('Create Budget', () => {
  let createBudgetUseCase: CreateBudgetUseCase;
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
    createBudgetUseCase = new CreateBudgetUseCase(budgetRepository);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('Create bugdet with a target successfully', async () => {
    const payload: CreateBudgetBody = {
      target: 10000,
    };

    jest.spyOn(budgetRepository, 'createBudget').mockImplementation(async () =>
      Promise.resolve({
        state: BudgetState.PLANNING,
        target: new Decimal(10000),
        owner_id: user.id,
        id: randomUUID(),
        createdAt: new Date(),
        startAt: undefined,
        doneAt: undefined,
      }),
    );

    const budget = await createBudgetUseCase.execute(payload, user);

    expect(budget.target).toEqual(new Decimal(10000));
    expect(budget.owner_id).toBe(user.id);
    expect(budget.state).toBe(BudgetState.PLANNING);
  });

  it('Create bugdet without a target successfully', async () => {
    const payload: CreateBudgetBody = {};

    jest.spyOn(budgetRepository, 'createBudget').mockImplementation(async () =>
      Promise.resolve({
        state: BudgetState.PLANNING,
        target: undefined,
        owner_id: user.id,
        id: randomUUID(),
        createdAt: new Date(),
        startAt: undefined,
        doneAt: undefined,
      }),
    );

    const budget = await createBudgetUseCase.execute(payload, user);

    expect(budget.target).toBeUndefined();
    expect(budget.owner_id).toBe(user.id);
    expect(budget.state).toBe(BudgetState.PLANNING);
  });

  it('Should throw error when passing target value lower or equal than 0', async () => {
    const payload: CreateBudgetBody = {
      target: -10000,
    };

    expect(() =>
      createBudgetUseCase.execute(payload, user),
    ).rejects.toThrowError('Target value should be higher than 0');
  });

  it('Should throw error when passing target value NaN', async () => {
    const payload: CreateBudgetBody = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Ignore to throw error
      target: 'NaN',
    };

    expect(() =>
      createBudgetUseCase.execute(payload, user),
    ).rejects.toThrowError('Target should be a number');
  });
});
