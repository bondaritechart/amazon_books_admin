import { LOGIN } from '@/data-access/auth/mutations/login';
import { useMutation } from '@apollo/client/react';

export const useLogin = () => {
  return useMutation(LOGIN);
};
