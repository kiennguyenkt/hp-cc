interface InfoTipProps { label: string; }

export function InfoTip({ label }: InfoTipProps) {
  return (
    <span className="info-tip" tabIndex={0} aria-label={label}>
      i
      <span className="info-tip__bubble" role="tooltip">{label}</span>
    </span>
  );
}
