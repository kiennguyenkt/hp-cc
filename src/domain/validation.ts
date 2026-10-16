export function parseNumericDraft(raw: string): number | null {
  const value = raw.trim();
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value)) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const normalized = Math.max(0, Math.floor(parsed));
  return Number.isSafeInteger(normalized) ? normalized : null;
}

export function normalizeNumericInput(raw: string): string {
  const parsed = parseNumericDraft(raw);
  return parsed === null ? raw.trim() : String(parsed);
}
