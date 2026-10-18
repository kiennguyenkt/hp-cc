import { sumOrNull } from '../../shared/math';
import { createResultWithFormula as resultWithFormula, type FormulaFormat } from '../resultWithFormula';

export const HP_PER_BOTTLE = 500;
export const FREE_DAILY_BOTTLES = 60;
export const BOTTLES_PER_DAILY_PURCHASE = 90;
export const DAILY_DIAMOND_PURCHASES = 5;
export const FREE_PACKAGE_BOTTLES = 10;
export const PAID_PACKAGE_BOTTLES = 200;

export function bottlesToHp(bottles: number | null): number | null {
  return bottles === null ? null : bottles * HP_PER_BOTTLE;
}

export function calculateBottleHp(bottles: number | null) {
  const bottleHpValue = bottlesToHp(bottles);
  const bottleHpFormula = (value: number | null, { formatNumber: f, label: l }: FormulaFormat) =>
    `${f(bottles)} ${l('bottles')} × ${f(HP_PER_BOTTLE)} HP = ${f(value)} HP`;

  return resultWithFormula(bottleHpValue, bottleHpFormula);
}

interface BottleResourceInputs {
  currentBottles: number | null;
  daysRemaining: number | null;
  buyPackage249: boolean;
  buyDailyDiamonds: boolean;
}

export function calculateBottleResources({
  currentBottles, daysRemaining, buyPackage249, buyDailyDiamonds,
}: BottleResourceInputs) {
  const paidDailyBottles = BOTTLES_PER_DAILY_PURCHASE * DAILY_DIAMOND_PURCHASES;
  const dailyBottles = FREE_DAILY_BOTTLES + (buyDailyDiamonds ? paidDailyBottles : 0);
  const packagePerDay = FREE_PACKAGE_BOTTLES + (buyPackage249 ? PAID_PACKAGE_BOTTLES : 0);
  const futureDailyBottles = daysRemaining === null ? null : daysRemaining * dailyBottles;
  const futurePackageBottles = daysRemaining === null ? null : daysRemaining * packagePerDay;
  const totalBottlesValue = sumOrNull(currentBottles, futureDailyBottles, futurePackageBottles);
  const totalBottlesFormula = (value: number | null, { formatNumber: f, label: l }: FormulaFormat) =>
    `${f(currentBottles)} + ${f(daysRemaining)} × ${f(dailyBottles)} (Daily) + ${f(daysRemaining)} × ${f(packagePerDay)} (249/free) = ${f(value)} ${l('bottles')}`;
  const totalBottles = resultWithFormula(totalBottlesValue, totalBottlesFormula);

  return {
    dailyBottles,
    futureDailyBottles,
    futurePackageBottles,
    totalBottles,
    totalBottleHp: calculateBottleHp(totalBottles.value),
  };
}
