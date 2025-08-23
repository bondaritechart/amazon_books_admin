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
import { Currency } from 'types/graphql';
import { getCurrencySymbol } from 'lib/utils';
import styles from './CurrencyInput.module.scss';

type ControlledCurrencyInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  currencySymbol?: string;
  currency?: Currency;
};

export function ControlledCurrencyInput<T extends FieldValues>({
  name,
  label,
  placeholder = "0.00",
  className,
  currencySymbol,
  currency,
}: ControlledCurrencyInputProps<T>) {
  const { control } = useFormContext<T>();

  // Get the currency symbol from the currency prop or use the provided currencySymbol
  const displaySymbol = currency ? getCurrencySymbol(currency) : (currencySymbol || "$");

  const formatCurrencyValue = (value: string) => {
    // Remove any non-numeric characters except decimal point
    let cleaned = value.replace(/[^\d.]/g, '');
    
    // Handle multiple decimal points - keep only the first one
    const decimalIndex = cleaned.indexOf('.');
    if (decimalIndex !== -1) {
      cleaned = cleaned.substring(0, decimalIndex + 1) + cleaned.substring(decimalIndex + 1).replace(/\./g, '');
    }
    
    // Limit to 2 decimal places
    if (decimalIndex !== -1 && cleaned.length > decimalIndex + 3) {
      cleaned = cleaned.substring(0, decimalIndex + 3);
    }
    
    return cleaned;
  };

  const validateCurrencyValue = (value: string) => {
    if (!value) return true; // Allow empty values
    
    // Check if it's a valid currency format (numbers with optional 2 decimal places)
    const currencyRegex = /^\d+(\.\d{0,2})?$/;
    if (!currencyRegex.test(value)) {
      return 'Please enter a valid currency amount (e.g., 10.50)';
    }
    
    // Check if the value is positive
    const numValue = parseFloat(value);
    if (numValue < 0) {
      return 'Amount must be positive';
    }
    
    return true;
  };

  return (
    <Box gap="spacing8" className={className}>
      {label && <Typography type="label">{label}</Typography>}
      <Controller
        name={name}
        control={control}
        rules={{
          validate: validateCurrencyValue,
        }}
        render={({ field, fieldState }) => (
          <>
            <div className={styles.currencyInputWrapper}>
              <span className={styles.currencySymbol}>{displaySymbol}</span>
              <input
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  const formattedValue = formatCurrencyValue(e.target.value);
                  field.onChange(formattedValue);
                }}
                placeholder={placeholder}
                className={styles.currencyInput}
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]{0,2}"
              />
            </div>
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