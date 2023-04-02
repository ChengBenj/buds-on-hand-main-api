import { Budget, User } from '@prisma/client';

import BudgetRepository from 'repositories/budgetRepository';
import BudgetRepositoryPrisma from 'repositories/budgetRepositoryPrisma';

import { PrismaService } from 'services/database/prisma.service';
import DeleteBudgetUseCase from 'domain/budget/useCases/DeleteBudget';

describe('Delete Budget', () => {
  let deleteBudgetUseCase: DeleteBudgetUseCase;
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
    deleteBudgetUseCase = new DeleteBudgetUseCase(budgetRepository);
  });

  it('Delete the budget', async () => {
    const budgetMock: Budget = {
      id: '3',
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

    jest
      .spyOn(budgetRepository, 'deleteBudget')
      .mockImplementation(async () => null);

    expect(await deleteBudgetUseCase.execute('3', user)).toBeUndefined();
  });

  it('Should throw error when tries to delete a non existent budget', async () => {
    jest
      .spyOn(budgetRepository, 'getUserBudgetById')
      .mockImplementation(async () => null);

    jest
      .spyOn(budgetRepository, 'deleteBudget')
      .mockImplementation(async () => null);

    expect(() => deleteBudgetUseCase.execute('3', user)).rejects.toThrow(
      'Budget not found',
    );
  });
});
