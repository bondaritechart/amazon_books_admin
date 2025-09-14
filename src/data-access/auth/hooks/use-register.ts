import { REGISTER } from '../mutations/register';
import { useMutation } from '@apollo/client/react';

export const useRegister = () => {
  return useMutation(REGISTER);
};
