'use client';

import { Box } from 'components/ui/Box/Box';
import { Typography } from 'components/ui/Typography/Typography';
import React from 'react';
import {
  Controller,
  useFormContext,
  FieldValues,
  FieldPath,
} from 'react-hook-form';
import styles from './Input.module.scss';

type ControlledTextInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  type?: string;
};

export function ControlledTextInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  className,
  ...rest
}: ControlledTextInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Box gap="spacing8" className={className}>
      {label && <Typography type="label">{label}</Typography>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <input
              {...field}
              placeholder={placeholder}
              className={styles.input}
              {...rest}
            />
            {fieldState.error && (
              <div style={{ color: 'red', marginTop: 2 }}>
                <Typography>{fieldState.error.message}</Typography>
              </div>
            )}
          </>
        )}
      />
    </Box>
  );
}
