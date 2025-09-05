import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { Theme } from '@radix-ui/themes';
import React from 'react';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <NextThemeProvider>
      <Theme>{children}</Theme>
    </NextThemeProvider>
  );
};
