import { createDefaultConfig } from './domain/defaultConfig';
import type { CalculatorConfig, Locale } from './domain/types';

const CONFIG_KEY = 'hp-calculator:configs:v1';
const LOCALE_KEY = 'hp-calculator:locale';
const supportedLocales: Locale[] = ['vi', 'en', 'th', 'id', 'zh'];

interface StoredState { schemaVersion: 1; configs: CalculatorConfig[]; activeId: string; }

export function loadConfigs(): { configs: CalculatorConfig[]; activeId: string } {
  try {
    const parsed = JSON.parse(localStorage.getItem(CONFIG_KEY) ?? '') as Partial<StoredState>;
    if (parsed.schemaVersion !== 1 || !Array.isArray(parsed.configs) || parsed.configs.length === 0) throw new Error();
    const configs = parsed.configs.map((config) => ({ ...createDefaultConfig(config.id), ...config }));
    const activeId = configs.some((config) => config.id === parsed.activeId) ? parsed.activeId! : configs[0].id;
    return { configs, activeId };
  } catch {
    const config = createDefaultConfig();
    return { configs: [config], activeId: config.id };
  }
}

export function saveConfigs(configs: CalculatorConfig[], activeId: string): void {
  const state: StoredState = { schemaVersion: 1, configs, activeId };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(state));
}

export function loadLocale(): Locale {
  const stored = localStorage.getItem(LOCALE_KEY);
  return supportedLocales.includes(stored as Locale) ? stored as Locale : 'vi';
}

export function saveLocale(locale: Locale): void { localStorage.setItem(LOCALE_KEY, locale); }
