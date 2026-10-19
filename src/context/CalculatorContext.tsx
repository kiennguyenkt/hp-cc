import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { CalculatorConfig, CalculatorResult } from '../domain/types';

interface CalculatorContextValue {
  config: CalculatorConfig;
  result: CalculatorResult;
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null);

interface CalculatorProviderProps extends CalculatorContextValue {
  children: ReactNode;
}

export function CalculatorProvider({
  config,
  result,
  children,
}: CalculatorProviderProps) {
  const value = useMemo(() => ({ config, result }), [config, result]);
  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}
