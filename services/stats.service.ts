import { Transaction } from "./transaction.service";
import { CurrencyRates } from './rates.service'

export type CurrencyData = {
  completedWithdrawals: number;
  completedDeposits: number;
  pendingWithdrawals: number;
  pendingDeposits: number;
  totalBalance: number;
  totalBalanceEur: number | null;
}

export type TransactionCounted = {
  completedWithdrawals: number;
  completedDeposits: number;
  totalCompletedWithdrawals: number;
  totalCompletedDeposits: number;
  pendingWithdrawals: number;
  pendingDeposits: number;
}

export const calcStats = (transactions: Transaction[], rates: CurrencyRates) => {
  const transactionsCouted = transactions.reduce(
    (acc: Record<string, TransactionCounted>, transaction) => {
      const { currency, type, status, amount } = transaction;

      if (!rates[currency]) {
        return acc;
      }

      if (!acc[currency]) {
        acc[currency] = {
          completedWithdrawals: 0,
          completedDeposits: 0,
          totalCompletedWithdrawals: 0,
          totalCompletedDeposits: 0,
          pendingWithdrawals: 0,
          pendingDeposits: 0,
        };
      }

      if (type === "withdrawal" && status === "completed") {
        acc[currency].completedWithdrawals++;
        acc[currency].totalCompletedWithdrawals += amount;
      } else if (type === "deposit" && status === "completed") {
        acc[currency].completedDeposits++;
        acc[currency].totalCompletedDeposits += amount;
      } else if (type === "withdrawal" && status === "pending") {
        acc[currency].pendingWithdrawals++;
      } else if (type === "deposit" && status === "pending") {
        acc[currency].pendingDeposits++;
      }

      return acc;
    },
    {}
  );

  let result: Record<string, CurrencyData> = {};
  for (const currency in transactionsCouted) {
    const { 
      completedWithdrawals, 
      completedDeposits,
      pendingWithdrawals,
      pendingDeposits,
      totalCompletedDeposits,
      totalCompletedWithdrawals
    } = transactionsCouted[currency];
    const totalBalance = totalCompletedDeposits - totalCompletedWithdrawals;
    
    let totalBalanceEur: number | null;
    if (!rates[currency]) {
      totalBalanceEur = null;
    } else {
      totalBalanceEur = totalBalance * rates[currency]!;
    }
    
    result[currency] = {
      completedWithdrawals,
      completedDeposits,
      pendingWithdrawals,
      pendingDeposits,
      totalBalance,
      totalBalanceEur,
    };
  }

  return result
}
