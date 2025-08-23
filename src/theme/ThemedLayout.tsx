'use client';

import React from 'react';
import { useTheme } from 'theme/ThemeProvider';
import styles from './themes.module.scss';

interface ThemedLayoutProps {
  children: React.ReactNode;
}

const ThemedLayout: React.FC<ThemedLayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return <div className={`${styles.theme} ${styles[theme]}`}>{children}</div>;
};

export default ThemedLayout;
