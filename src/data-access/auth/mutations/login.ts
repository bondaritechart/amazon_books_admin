import { USER_FRAGMENT } from '@/data-access/auth/fragments/user';
import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...User
      }
    }
  }

  ${USER_FRAGMENT}
`;
