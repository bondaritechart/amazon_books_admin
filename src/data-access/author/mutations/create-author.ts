import { gql } from '@apollo/client';

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($input: CreateAuthorInput!) {
    createAuthor(input: $input) {
      id
      firstName
      lastName
      biography
      avatar
    }
  }
`;
