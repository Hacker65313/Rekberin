'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import SplashScreen from './SplashScreen';

const SplashContext = createContext<{ hide: () => void } | null>(null);

export function useSplash() {
  return useContext(SplashContext);
}

/**
 * SplashProvider menampilkan splash screen selama ~3 detik saat
 * pertama kali aplikasi dibuka (per session browser).
 */
export function SplashProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    // Hanya tampilkan splash di home page dan jika belum ditampilkan di session ini
    const isHome = window.location.pathname === '/';
    const seen = sessionStorage.getItem('splash_shown');
    if (isHome && !seen) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('splash_shown', '1');
      }, 3000);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, []);

  if (show === null) {
    // Saat belum tentukan: jangan render apapun dulu untuk hindari flicker
    return null;
  }

  if (show) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
