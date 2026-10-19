import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Locale } from '../domain/types';
import { translator } from '../i18n';
import { loadLocale, saveLocale } from '../storage';

const numberLocales: Record<Locale, string> = {
  vi: 'vi-VN',
  en: 'en-US',
  th: 'th-TH',
  id: 'id-ID',
  zh: 'zh-CN',
};

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(loadLocale);
  const t = useMemo(() => translator(locale), [locale]);
  const numberFormat = useMemo(
    () =>
      new Intl.NumberFormat(numberLocales[locale], {
        maximumFractionDigits: 0,
      }),
    [locale],
  );
  const format = useCallback(
    (value: number | null) =>
      value === null || !Number.isFinite(value)
        ? t('invalid')
        : numberFormat.format(value),
    [numberFormat, t],
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t('appTitle');
  }, [locale, t]);

  const changeLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    saveLocale(nextLocale);
  };

  return { locale, changeLocale, t, format };
}
