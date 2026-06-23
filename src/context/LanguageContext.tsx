import { createContext, useContext, useState, type ReactNode } from 'react';
import type { SupportedLang } from '../types';

interface LanguageContextValue {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>(() => {
    const stored = localStorage.getItem('learn-dutch-lang');
    return stored === 'es' ? 'es' : 'en';
  });

  const setLang = (next: SupportedLang) => {
    setLangState(next);
    localStorage.setItem('learn-dutch-lang', next);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
