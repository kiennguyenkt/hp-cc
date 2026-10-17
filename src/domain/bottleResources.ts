import { sumOrNull } from '../shared/math';

export const HP_PER_BOTTLE = 500;
export const FREE_DAILY_BOTTLES = 60;
export const BOTTLES_PER_DAILY_PURCHASE = 90;
export const DAILY_DIAMOND_PURCHASES = 5;
export const FREE_PACKAGE_BOTTLES = 10;
export const PAID_PACKAGE_BOTTLES = 200;

export function bottlesToHp(bottles: number | null): number | null {
  return bottles === null ? null : bottles * HP_PER_BOTTLE;
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
  const totalBottles = sumOrNull(currentBottles, futureDailyBottles, futurePackageBottles);
  const baseFutureBottles = daysRemaining === null
    ? null
    : daysRemaining * (FREE_DAILY_BOTTLES + FREE_PACKAGE_BOTTLES);

  return {
    dailyBottles,
    futureDailyBottles,
    futurePackageBottles,
    totalBottles,
    totalBottleHp: bottlesToHp(totalBottles),
    baseBottleHp: bottlesToHp(sumOrNull(currentBottles, baseFutureBottles)),
    paidPackageHp: bottlesToHp(daysRemaining === null ? null : daysRemaining * PAID_PACKAGE_BOTTLES),
    paidDailyHp: bottlesToHp(daysRemaining === null ? null : daysRemaining * paidDailyBottles),
  };
}
