import { randomUUID } from 'node:crypto';
import { Budget, BudgetState, User } from '@prisma/client';

import BudgetRepository from 'repositories/budgetRepository';
import BudgetRepositoryPrisma from 'repositories/budgetRepositoryPrisma';

import { PrismaService } from 'services/database/prisma.service';
import UpdateBudgetStateUseCase from 'domain/budget/useCases/UpdateBudgetState';

describe('Create Budget', () => {
  let updateBudgetStateUseCase: UpdateBudgetStateUseCase;
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
    updateBudgetStateUseCase = new UpdateBudgetStateUseCase(budgetRepository);
  });

  it('Should update budget state forward successfully', async () => {
    const id = randomUUID();
    const newDate = new Date();

    const budgetMock: Budget = {
      id,
      state: BudgetState.PLANNING,
      createdAt: new Date(),
      owner_id: user.id,
      target: undefined,
      doneAt: undefined,
      startAt: undefined,
    };

    jest
      .spyOn(budgetRepository, 'getUserBudgetById')
      .mockImplementation(async () => budgetMock);

    jest
      .spyOn(budgetRepository, 'updateBudget')
      .mockImplementation(async () => ({
        ...budgetMock,
        state: BudgetState.DOING,
        startAt: newDate,
      }));

    const budget = await updateBudgetStateUseCase.execute(
      id,
      BudgetState.DOING,
      user,
    );

    expect(budget.state).toEqual(BudgetState.DOING);
    expect(budget.startAt).toEqual(newDate);
  });

  it('Should update budget state backward successfully', async () => {
    const id = randomUUID();
    const newDate = new Date();

    const budgetMock: Budget = {
      id,
      state: BudgetState.DONE,
      createdAt: new Date(),
      owner_id: user.id,
      target: undefined,
      doneAt: new Date(),
      startAt: new Date(),
    };

    jest
      .spyOn(budgetRepository, 'getUserBudgetById')
      .mockImplementation(async () => budgetMock);

    jest
      .spyOn(budgetRepository, 'updateBudget')
      .mockImplementation(async () => ({
        ...budgetMock,
        state: BudgetState.DOING,
        startAt: newDate,
        doneAt: undefined,
      }));

    const budget = await updateBudgetStateUseCase.execute(
      id,
      BudgetState.DOING,
      user,
    );

    expect(budget.state).toEqual(BudgetState.DOING);
    expect(budget.startAt).toEqual(newDate);
    expect(budget.doneAt).toBeUndefined();
  });

  it('Throw erro when budget does not exists', async () => {
    const id = randomUUID();

    jest
      .spyOn(budgetRepository, 'getUserBudgetById')
      .mockImplementation(async () => null);

    expect(() =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateBudgetStateUseCase.execute(id, 'THIS_STATE_DOESNT_EXISTS', user),
    ).rejects.toThrow('This state does exists');
  });

  it('Throw error when pass an invalid state', async () => {
    const id = randomUUID();

    expect(() =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      updateBudgetStateUseCase.execute(id, 'THIS_STATE_DOESNT_EXISTS', user),
    ).rejects.toThrow('This state does exists');
  });
});
