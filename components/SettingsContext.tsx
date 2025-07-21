import React, { createContext, useContext, useState, ReactNode } from 'react';

type TextSize = 'normal' | 'large' | 'extra-large';

interface SettingsContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  getTextSizeClasses: () => {
    small: string;
    base: string;
    heading: string;
  };
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [textSize, setTextSize] = useState<TextSize>('normal');

  const getTextSizeClasses = () => {
    switch (textSize) {
      case 'normal':
        return {
          small: 'text-sm',
          base: 'text-base',
          heading: 'text-lg'
        };
      case 'large':
        return {
          small: 'text-base',
          base: 'text-lg',
          heading: 'text-xl'
        };
      case 'extra-large':
        return {
          small: 'text-lg',
          base: 'text-xl',
          heading: 'text-2xl'
        };
      default:
        return {
          small: 'text-sm',
          base: 'text-base',
          heading: 'text-lg'
        };
    }
  };

  return (
    <SettingsContext.Provider value={{ textSize, setTextSize, getTextSizeClasses }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}