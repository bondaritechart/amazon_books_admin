import { CREATE_AUTHOR } from '../mutations/create-author';
import { useMutation } from '@apollo/client/react';

export const useCreateAuthor = () => {
  return useMutation(CREATE_AUTHOR);
};
