import { gql } from '@apollo/client';

// Example mutation for saving file metadata after upload
export const SAVE_FILE_METADATA = gql`
  mutation SaveFileMetadata($input: FileMetadataInput!) {
    saveFileMetadata(input: $input) {
      id
      url
      filename
      size
      mimeType
      createdAt
    }
  }
`;

// Example mutation for updating user avatar
export const UPDATE_USER_AVATAR = gql`
  mutation UpdateUserAvatar($avatarUrl: String!) {
    updateUserAvatar(avatarUrl: $avatarUrl) {
      id
      avatar
    }
  }
`;

// Example mutation for creating author with avatar
export const CREATE_AUTHOR_WITH_AVATAR = gql`
  mutation CreateAuthorWithAvatar($input: CreateAuthorInput!) {
    createAuthor(input: $input) {
      id
      firstName
      lastName
      avatar
      biography
    }
  }
`;

