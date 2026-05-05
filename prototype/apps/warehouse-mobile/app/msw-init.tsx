'use client';
import { useEffect, useState } from 'react';

export const MSWInit = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    (async () => {
      const { setupWorker } = await import('msw/browser');
      const { handlers } = await import('@uniprint/mocks');
      const worker = setupWorker(...handlers);
      await worker.start({ onUnhandledRequest: 'bypass' });
      setReady(true);
    })();
  }, []);
  if (!ready) return <div className="p-8 text-center text-[var(--color-fg-muted)]">Загрузка моков…</div>;
  return <>{children}</>;
};
