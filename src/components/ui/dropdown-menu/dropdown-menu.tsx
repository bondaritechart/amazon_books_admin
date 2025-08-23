'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './dropdown-menu.module.scss';
import { CiMenuKebab } from 'react-icons/ci';
export interface DropdownMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  onOpenChange?: (isOpen: boolean) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  position = 'bottom-left',
  disabled = false,
  className,
  menuClassName,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  const handleItemClick = (item: DropdownMenuItem) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }

    if (item.href) {
      window.location.href = item.href;
    }

    closeDropdown();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeDropdown();
      triggerRef.current?.focus();
    }
  };

  const handleItemKeyDown = (
    event: React.KeyboardEvent,
    item: DropdownMenuItem
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleItemClick(item);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={`${styles.dropdown} ${className || ''}`}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${disabled ? styles.disabled : ''}`}
        onClick={toggleDropdown}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <CiMenuKebab />
      </button>

      {isOpen && (
        <div
          className={`${styles.menu} ${styles[position]} ${menuClassName || ''}`}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`${styles.menuItem} ${item.disabled ? styles.disabled : ''} ${item.className || ''}`}
              role="menuitem"
              tabIndex={item.disabled ? -1 : 0}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => handleItemKeyDown(e, item)}
              aria-disabled={item.disabled}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span className={styles.label}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
