'use client';

import { Box } from 'components/ui/Box/Box';
import { Typography } from 'components/ui/Typography/Typography';
import React, { useState, useRef, useEffect } from 'react';
import {
  Controller,
  useFormContext,
  FieldValues,
  FieldPath,
} from 'react-hook-form';
import styles from './Dropdown.module.scss';

export interface DropdownOption {
  value: unknown;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface DropdownCustomization {
  // Container customization
  containerClassName?: string;
  dropdownClassName?: string;

  // Trigger customization
  triggerClassName?: string;
  triggerIcon?: React.ReactNode;
  triggerIconPosition?: 'left' | 'right';

  // Option customization
  optionClassName?: string;
  optionSelectedClassName?: string;
  optionDisabledClassName?: string;
  optionRenderer?: (
    option: DropdownOption,
    isSelected: boolean
  ) => React.ReactNode;

  // Selected value customization
  selectedValueRenderer?: (option: DropdownOption | null) => React.ReactNode;

  // Dropdown appearance
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchClassName?: string;

  // Icons
  chevronIcon?: React.ReactNode;
  searchIcon?: React.ReactNode;
  clearIcon?: React.ReactNode;

  // Behavior
  clearable?: boolean;
  closeOnSelect?: boolean;
  maxHeight?: string;
}

type ControlledDropdownProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  options: DropdownOption[];
  customization?: DropdownCustomization;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  noOptionsText?: string;
  onSearch?: (searchTerm: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

export function ControlledDropdown<T extends FieldValues>({
  name,
  label,
  placeholder = 'Select an option',
  className,
  options,
  customization = {},
  multiple = false,
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  noOptionsText = 'No options available',
  onSearch,
  onOpen,
  onClose,
}: ControlledDropdownProps<T>) {
  const { control } = useFormContext<T>();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    containerClassName = '',
    dropdownClassName = '',
    triggerClassName = '',
    triggerIcon,
    triggerIconPosition = 'left',
    optionClassName = '',
    optionSelectedClassName = '',
    optionDisabledClassName = '',
    optionRenderer,
    selectedValueRenderer,
    showSearch = false,
    searchPlaceholder = 'Search...',
    searchClassName = '',
    chevronIcon,
    searchIcon,
    clearIcon,
    clearable = false,
    closeOnSelect = true,
    maxHeight = '200px',
  } = customization;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (onSearch && searchTerm) {
      onSearch(searchTerm);
    }
  }, [searchTerm, onSearch]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, showSearch]);

  const handleOpen = () => {
    if (disabled || loading) return;
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm('');
    onClose?.();
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const getSelectedOption = (value: unknown): DropdownOption | null => {
    if (value === null || value === undefined) return null;
    return options.find((option) => option.value === value) || null;
  };

  const getSelectedOptions = (
    values: unknown | unknown[]
  ): DropdownOption[] => {
    if (!Array.isArray(values)) return [];
    return values
      .map((value) => options.find((option) => option.value === value))
      .filter(Boolean) as DropdownOption[];
  };

  const handleOptionSelect = (
    option: DropdownOption,
    onChange: (value: unknown) => void,
    currentValue: unknown
  ) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];
      const isSelected = currentValues.includes(option.value);

      if (isSelected) {
        onChange(currentValues.filter((v) => v !== option.value));
      } else {
        onChange([...currentValues, option.value]);
      }
    } else {
      onChange(option.value);
      if (closeOnSelect) {
        handleClose();
      }
    }
  };

  const handleClear = (
    onChange: (value: unknown) => void,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onChange(multiple ? [] : null);
  };

  const filterOptions = (options: DropdownOption[]) => {
    if (!searchTerm) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderOption = (option: DropdownOption, isSelected: boolean) => {
    if (optionRenderer) {
      return optionRenderer(option, isSelected);
    }

    return (
      <div className={styles.optionContent}>
        {option.icon && (
          <span className={styles.optionIcon}>{option.icon}</span>
        )}
        <div className={styles.optionText}>
          <span className={styles.optionLabel}>{option.label}</span>
          {option.description && (
            <span className={styles.optionDescription}>
              {option.description}
            </span>
          )}
        </div>
        {isSelected && <span className={styles.selectedIndicator}>✓</span>}
      </div>
    );
  };

  const renderSelectedValue = (value: unknown) => {
    if (multiple) {
      const selectedOptions = getSelectedOptions(value);
      if (selectedOptions.length === 0) return placeholder;

      if (selectedValueRenderer) {
        return selectedOptions
          .map((option) => selectedValueRenderer(option))
          .join(', ');
      }

      return selectedOptions.map((option) => option.label).join(', ');
    } else {
      const selectedOption = getSelectedOption(value);
      if (!selectedOption) return placeholder;

      if (selectedValueRenderer) {
        return selectedValueRenderer(selectedOption);
      }

      return selectedOption.label;
    }
  };

  const renderOptions = (
    options: DropdownOption[],
    onChange: (value: unknown) => void,
    currentValue: unknown
  ) => {
    return options.map((option) => {
      const isSelected = multiple
        ? Array.isArray(currentValue) && currentValue.includes(option.value)
        : currentValue === option.value;

      return (
        <div
          key={option.label}
          className={`
            ${styles.option}
            ${optionClassName}
            ${isSelected ? `${styles.optionSelected} ${optionSelectedClassName}` : ''}
            ${option.disabled ? `${styles.optionDisabled} ${optionDisabledClassName}` : ''}
          `.trim()}
          onClick={() => handleOptionSelect(option, onChange, currentValue)}
        >
          {renderOption(option, isSelected)}
        </div>
      );
    });
  };

  return (
    <Box gap="spacing8" className={className}>
      {label && <Typography type="label">{label}</Typography>}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <div
              ref={dropdownRef}
              className={`${styles.container} ${containerClassName}`}
            >
              <div
                className={`
                  ${styles.trigger}
                  ${triggerClassName}
                  ${isOpen ? styles.triggerOpen : ''}
                  ${disabled ? styles.triggerDisabled : ''}
                  ${fieldState.error ? styles.triggerError : ''}
                `.trim()}
                onClick={handleToggle}
              >
                {triggerIcon && triggerIconPosition === 'left' && (
                  <span className={styles.triggerIconLeft}>{triggerIcon}</span>
                )}

                <span className={styles.triggerText}>
                  {loading ? loadingText : renderSelectedValue(field.value)}
                </span>

                {clearable &&
                  field.value &&
                  (multiple ? field.value.length > 0 : true) && (
                    <button
                      type="button"
                      className={styles.clearButton}
                      onClick={(e) => handleClear(field.onChange, e)}
                    >
                      {clearIcon || '×'}
                    </button>
                  )}

                {triggerIcon && triggerIconPosition === 'right' && (
                  <span className={styles.triggerIconRight}>{triggerIcon}</span>
                )}

                <span
                  className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                >
                  {chevronIcon || '▼'}
                </span>
              </div>

              {isOpen && (
                <div
                  className={`${styles.dropdown} ${dropdownClassName}`}
                  style={{ maxHeight }}
                >
                  {showSearch && (
                    <div className={styles.searchContainer}>
                      {searchIcon && (
                        <span className={styles.searchIcon}>{searchIcon}</span>
                      )}
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${styles.searchInput} ${searchClassName}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}

                  <div className={styles.optionsContainer}>
                    {loading ? (
                      <div className={styles.loadingState}>{loadingText}</div>
                    ) : (
                      (() => {
                        const filteredOptions = filterOptions(options);

                        if (filteredOptions.length === 0) {
                          return (
                            <div className={styles.noOptions}>
                              {noOptionsText}
                            </div>
                          );
                        }

                        return renderOptions(
                          filteredOptions,
                          field.onChange,
                          field.value
                        );
                      })()
                    )}
                  </div>
                </div>
              )}
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
