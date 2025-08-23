'use client';
import { IoIosClose } from 'react-icons/io';
import React, { useEffect, useRef } from 'react';
import { Button, ButtonProps } from '../Button/Button';
import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  confirmButtonProps?: {
    label: string;
    action: () => void;
  } & Omit<ButtonProps, 'children'>;
  cancelButtonProps?: {
    label: string;
    action?: () => void;
  } & Omit<ButtonProps, 'children'>;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmButtonProps,
  cancelButtonProps,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'medium',
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (confirmButtonProps) {
      confirmButtonProps.action();
    } else {
      onClose();
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (cancelButtonProps) {
      cancelButtonProps.action?.();
    }
    onClose();
  };

  if (!isOpen) return null;

  const modalClasses = [styles.modal, styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={modalClasses} ref={modalRef}>
        {/* Header */}
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <IoIosClose size="2rem" />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>{children}</div>

        {/* Footer */}
        {(confirmButtonProps || cancelButtonProps) && (
          <div className={styles.footer}>
            {cancelButtonProps && (
              <Button
                variant="ghost"
                onClick={handleCancel}
                {...cancelButtonProps}
              >
                {cancelButtonProps.label}
              </Button>
            )}
            {confirmButtonProps && (
              <Button
                variant="primary"
                onClick={handleConfirm}
                {...confirmButtonProps}
              >
                {confirmButtonProps.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
