import Image from "next/image";
import React, { useMemo } from "react";
import { getEurRates } from "@/services/rates.service";
import { getTransaction, transactionAddEur } from "@/services/transaction.service";
import { calcStats } from "@/services/stats.service";

export default async function Home() {
  const [eurRates, transactionsRaw] = await Promise.all([
    getEurRates(),
    getTransaction(),
  ]);

  // It would make sense to wrap it into useMemo, but I'm using next.js 13 so there is no need in this.
  const stats = calcStats(transactionsRaw, eurRates);
  const transactionWithEur = transactionAddEur(transactionsRaw, eurRates)

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-12">
      <h1 className="text-3xl font-bold">Transactions</h1>
      <div className="z-10 max-w-12xl w-full items-center justify-between font-mono text-sm ">
        <div className="grid grid-cols-6 gap-4 mb-4">
          <div>timestamp</div>
          <div>currency</div>
          <div>amount</div>
          <div>eur equiv</div>
          <div>type</div>
          <div>status</div>
        </div>
        {transactionWithEur.map((transaction: any) => (
          <div key={transaction.id} className="grid grid-cols-6 gap-4">
            <div>{transaction.timestamp}</div>
            <div>{transaction.currency}</div>
            <div>{transaction.amount}</div>
            <div>{transaction.totalBalanceEur || '-'}</div>
            <div>{transaction.type}</div>
            <div>{transaction.status}</div>
          </div>
        ))}
      </div>
      <h1 className="text-3xl font-bold">EUR Rates</h1>
      <div className="z-10 max-w-12xl w-full items-center justify-between font-mono text-sm ">
        <div className="grid grid-cols-7 gap-4 mb-4">
          <div>currency</div>
          <div>total completed withdrawals</div>
          <div>total completed deposits</div>
          <div>total pending withdrawals</div>
          <div>total pending deposits</div>
          <div>total balance (completed deposits - completed withdrawals)</div>
          <div>total balance eur equiv</div>
        </div>
        {Object.entries(stats).map(([currency, data]) => (
          <div key={currency} className="grid grid-cols-7 gap-4">
            <div>{currency}</div>
            <div>{data.completedWithdrawals}</div>
            <div>{data.completedDeposits}</div>
            <div>{data.pendingWithdrawals}</div>
            <div>{data.pendingDeposits}</div>
            <div>{data.totalBalance}</div>
            <div>{data.totalBalanceEur}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
