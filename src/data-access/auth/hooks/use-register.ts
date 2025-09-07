import { REGISTER } from '../mutations/register';
import { useMutation } from '@apollo/client';

export const useRegister = () => {
  return useMutation(REGISTER);
};
