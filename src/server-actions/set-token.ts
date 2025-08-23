'use server';

import { cookies } from 'next/headers';

export const setToken = async (token: string) => {
  if (!token) return false;
  const cookieStore = await cookies();
  cookieStore.set('accessToken', token);
  return true;
};
