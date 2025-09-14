'use client';

import { GET_AUTHORS } from '../queries/get-authors';
import { useSuspenseQuery } from '@apollo/client/react';

export const useGetAuthors = () => {
  return useSuspenseQuery(GET_AUTHORS);
};
