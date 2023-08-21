import { get } from './api.service'

export type CurrencyRates = {
  [currency: string]: number | null;
};

export const getEurRates = async (): Promise<CurrencyRates> => {
  const result = await get('/eur-rates')

  return result
}
