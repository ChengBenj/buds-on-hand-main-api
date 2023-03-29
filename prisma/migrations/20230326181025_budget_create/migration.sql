-- CreateEnum
CREATE TYPE "BudgetState" AS ENUM ('PLANNING', 'DOING', 'DONE');

-- CreateTable
CREATE TABLE "budgets" (
    "id" TEXT NOT NULL,
    "state" "BudgetState" NOT NULL DEFAULT 'PLANNING',
    "target" DECIMAL(65,30),
    "owner_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startAt" TIMESTAMP(3),
    "doneAt" TIMESTAMP(3),

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
