import { Box } from 'components/ui/Box/Box';
import React from 'react';
import styles from './Card.module.scss';

interface CardProps extends React.PropsWithChildren {
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  const classes = [styles.card, className].join(' ');

  return (
    <Box className={classes} padding="spacing16">
      {children}
    </Box>
  );
};
