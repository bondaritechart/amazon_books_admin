import { USER_FRAGMENT } from '@/data-access/auth/fragments/user';
import { gql } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      ...User
    }
  }
  ${USER_FRAGMENT}
`;
