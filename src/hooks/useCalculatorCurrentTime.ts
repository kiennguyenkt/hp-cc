import { useEffect, useState } from 'react';

/** Refreshes the current time for calculator updates. */
export function useCalculatorCurrentTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    const timer = window.setInterval(refresh, 5000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return now;
}
