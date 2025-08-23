'use client';

import { Typography } from 'components/ui';
import React from 'react';
import { Modal, ModalProps } from './Modal';
import { ButtonProps } from '../Button/Button';
import styles from './ConfirmationModal.module.scss';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
  description: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  confirmButtonVariant?: ButtonProps['variant'];
  cancelButtonVariant?: ButtonProps['variant'];
  loading?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  size?: ModalProps['size'];
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  description,
  confirmButtonLabel = 'Confirm',
  cancelButtonLabel = 'Cancel',
  confirmButtonVariant = 'primary',
  cancelButtonVariant = 'ghost',
  loading = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'small',
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEscape={closeOnEscape}
      confirmButtonProps={{
        label: confirmButtonLabel,
        action: handleConfirm,
        variant: confirmButtonVariant,
        loading: loading,
        disabled: loading,
      }}
      cancelButtonProps={{
        label: cancelButtonLabel,
        action: handleCancel,
        variant: cancelButtonVariant,
        disabled: loading,
      }}
    >
      <div className={styles.description}>
        <Typography>{description}</Typography>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
