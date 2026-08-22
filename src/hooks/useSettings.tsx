import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppSettings } from '@/types/workout';
import { loadFromStorage, saveToStorage } from '@/utils/persistence';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleVoice: () => void;
  toggleSound: () => void;
}

const defaultSettings: AppSettings = {
  voiceEnabled: true,
  soundEnabled: true,
  theme: 'system'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    return loadFromStorage<AppSettings>('settings', defaultSettings);
  });

  useEffect(() => {
    saveToStorage('settings', settings);

    const applyTheme = (theme: 'light' | 'dark' | 'system') => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(systemPrefersDark ? 'dark' : 'light');
      } else {
        root.classList.add(theme);
      }
    };

    applyTheme(settings.theme);

    let mediaQuery: MediaQueryList | null = null;
    const handleChange = (e: MediaQueryListEvent) => {
      if (settings.theme === 'system') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(e.matches ? 'dark' : 'light');
      }
    };

    if (settings.theme === 'system') {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleChange);
    }

    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }, [settings]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggleVoice = useCallback(() => {
    setSettings((prev) => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleVoice, toggleSound }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
