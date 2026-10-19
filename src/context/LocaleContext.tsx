import { createContext, useContext, type ReactNode } from 'react';
import { useLocale } from '../hooks/useLocale';

type LocaleContextValue = ReturnType<typeof useLocale>;

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const value = useLocale();
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useI18n must be used within a LocaleProvider');
  }
  return context;
}

export function useTranslation() {
  return useI18n().t;
}

export function useFormat() {
  return useI18n().format;
}
