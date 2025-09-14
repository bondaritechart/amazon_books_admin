import { gql } from '@apollo/client';

export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      firstName
      lastName
      biography
      avatar
    }
  }
`;
