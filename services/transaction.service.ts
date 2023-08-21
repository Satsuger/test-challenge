import {get} from './api.service'
import { CurrencyRates } from './rates.service'

export type Transaction = {
  id: string;
  timestamp: string;
  type: "deposit" | "withdrawal";
  status: "completed" | "pending";
  currency: string;
  amount: number;
}

export type TransactionWithEur = Transaction & {
  totalBalanceEur: number | null;
}

export const getTransaction = async (): Promise<Transaction[]> => {
  const result = await get('/transactions')

  return result.transactions
}

export const transactionAddEur = (transactions: Transaction[], rates: CurrencyRates): TransactionWithEur[] => {
  return transactions.map(transaction => {
    let totalBalanceEur: number | null;
    if (!rates[transaction.currency]) {
      totalBalanceEur = null;
    } else {
      totalBalanceEur = transaction.amount * rates[transaction.currency]!;
    }    

    return{
      ...transaction,
      totalBalanceEur
    }})
}
