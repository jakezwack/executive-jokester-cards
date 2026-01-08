'use client';

import { useEffect } from 'react';

const EXECUTIVE_LEVEL_THRESHOLD = 3;
const THEME_CLASS = 'corporate-dark';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const evolutionCount = parseInt(localStorage.getItem('jokesterEvolutions') || '0', 10);
      
      if (evolutionCount >= EXECUTIVE_LEVEL_THRESHOLD) {
        document.documentElement.classList.add(THEME_CLASS);
      } else {
        document.documentElement.classList.remove(THEME_CLASS);
      }
    } catch (error) {
      console.error("Could not access local storage to apply theme.", error);
    }
  }, []);

  return <>{children}</>;
}
