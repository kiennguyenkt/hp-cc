import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './InfoTip.module.css';

interface InfoTipProps {
  label: string;
}

export function InfoTip({ label }: InfoTipProps) {
  const id = useId();
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!anchor) return;
    const close = () => setAnchor(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [anchor]);

  const width = Math.min(360, window.innerWidth - 24);
  const below = anchor !== null && anchor.top < 200;

  return (
    <span
      className={styles.infoTip}
      tabIndex={0}
      aria-label={label}
      aria-describedby={anchor ? id : undefined}
      onMouseEnter={(event) =>
        setAnchor(event.currentTarget.getBoundingClientRect())
      }
      onMouseLeave={() => setAnchor(null)}
      onFocus={(event) =>
        setAnchor(event.currentTarget.getBoundingClientRect())
      }
      onBlur={() => setAnchor(null)}
      onClick={(event) =>
        setAnchor(event.currentTarget.getBoundingClientRect())
      }
      onKeyDown={(event) => {
        if (event.key === 'Escape') setAnchor(null);
      }}
    >
      i
      {anchor &&
        createPortal(
          <span
            id={id}
            className={styles.infoPopover}
            role="tooltip"
            style={{
              width,
              left: Math.max(
                12,
                Math.min(
                  anchor.left + anchor.width / 2 - width / 2,
                  window.innerWidth - width - 12,
                ),
              ),
              top: below ? anchor.bottom + 9 : anchor.top - 9,
              transform: below ? undefined : 'translateY(-100%)',
            }}
          >
            {label}
          </span>,
          document.body,
        )}
    </span>
  );
}
