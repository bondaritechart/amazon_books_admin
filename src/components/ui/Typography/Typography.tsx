import React from 'react';
import styles from './Typography.module.scss';

interface TypographyProps extends React.PropsWithChildren {
  type?:
    | 'heading1'
    | 'heading2'
    | 'bodyMedium'
    | 'bodySmall'
    | 'bodyLarge'
    | 'bodyXLarge'
    | 'label';
}

export const Typography = ({
  children,
  type = 'bodyMedium',
}: TypographyProps) => {
  return <span className={styles[type]}>{children}</span>;
};
