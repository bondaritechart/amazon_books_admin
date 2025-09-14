/**
 * COMPREHENSIVE FILE UPLOAD EXAMPLES
 * 
 * This file demonstrates different ways to handle file uploads with GraphQL mutations
 * using the FileUpload and FileUploadGraphQL components.
 */

import { useForm, FormProvider } from 'react-hook-form';
import { Button, Flex, Card, Heading } from '@radix-ui/themes';
import { FileUpload, FileUploadGraphQL } from '@/components/form';
import { useFileUpload, useAvatarUpload } from '@/data-access/file/hooks/use-file-upload';
import { useMutation } from '@apollo/client/react';
import { CREATE_AUTHOR_WITH_AVATAR } from '@/data-access/file/mutations/upload-file';
import { UploadResponse } from '@/lib/file-upload';

// Example 1: Basic File Upload (without GraphQL integration)
interface BasicFormData {
  profileImage: File;
  documents: File[];
}

export const BasicFileUploadExample = () => {
  const methods = useForm<BasicFormData>();

  const onSubmit = async (data: BasicFormData) => {
    console.log('Profile image:', data.profileImage);
    console.log('Documents:', data.documents);
    
    // Here you would manually handle the file upload
    // and then use the URLs in your GraphQL mutations
  };

  return (
    <Card>
      <Heading size="4" mb="4">Basic File Upload Example</Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <FileUpload
              name="profileImage"
              label="Profile Image"
              accept="image/*"
            />
            
            <FileUpload
              name="documents"
              label="Documents"
              accept=".pdf,.doc,.docx"
              multiple
            />
            
            <Button type="submit">Submit</Button>
          </Flex>
        </form>
      </FormProvider>
    </Card>
  );
};

// Example 2: GraphQL-Integrated File Upload
interface GraphQLFormData {
  avatar: UploadResponse;
  attachments: UploadResponse[];
}

export const GraphQLFileUploadExample = () => {
  const methods = useForm<GraphQLFormData>();

  const onSubmit = async (data: GraphQLFormData) => {
    console.log('Uploaded avatar:', data.avatar);
    console.log('Uploaded attachments:', data.attachments);
    
    // Files are already uploaded and URLs are available
    // You can now use these URLs in your GraphQL mutations
  };

  return (
    <Card>
      <Heading size="4" mb="4">GraphQL File Upload Example</Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <FileUploadGraphQL
              name="avatar"
              label="Avatar"
              accept="image/*"
              saveMetadata={true}
              onUploadComplete={(responses) => {
                console.log('Avatar uploaded:', responses[0]);
              }}
            />
            
            <FileUploadGraphQL
              name="attachments"
              label="Attachments"
              accept=".pdf,.doc,.docx,.jpg,.png"
              multiple
              saveMetadata={true}
              onUploadComplete={(responses) => {
                console.log('Attachments uploaded:', responses);
              }}
            />
            
            <Button type="submit">Submit</Button>
          </Flex>
        </form>
      </FormProvider>
    </Card>
  );
};

// Example 3: Avatar Upload with Immediate GraphQL Update
export const AvatarUploadExample = () => {
  const { uploadAndUpdateAvatar, isUploading } = useAvatarUpload();

  const handleAvatarUpload = async (file: File) => {
    try {
      const result = await uploadAndUpdateAvatar(file);
      console.log('Avatar updated successfully:', result);
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  return (
    <Card>
      <Heading size="4" mb="4">Avatar Upload with Immediate Update</Heading>
      <Flex direction="column" gap="4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {isUploading && <p>Uploading and updating avatar...</p>}
      </Flex>
    </Card>
  );
};

// Example 4: Create Author with Avatar
interface CreateAuthorFormData {
  firstName: string;
  lastName: string;
  biography: string;
  avatar: UploadResponse;
}

export const CreateAuthorExample = () => {
  const methods = useForm<CreateAuthorFormData>();
  const [createAuthor, { loading }] = useMutation(CREATE_AUTHOR_WITH_AVATAR);

  const onSubmit = async (data: CreateAuthorFormData) => {
    try {
      const result = await createAuthor({
        variables: {
          input: {
            firstName: data.firstName,
            lastName: data.lastName,
            biography: data.biography,
            avatar: data.avatar.url, // Use the uploaded file URL
          },
        },
      });
      
      console.log('Author created successfully:', result.data.createAuthor);
    } catch (error) {
      console.error('Failed to create author:', error);
    }
  };

  return (
    <Card>
      <Heading size="4" mb="4">Create Author with Avatar</Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <input
              type="text"
              placeholder="First Name"
              {...methods.register('firstName', { required: true })}
            />
            
            <input
              type="text"
              placeholder="Last Name"
              {...methods.register('lastName', { required: true })}
            />
            
            <textarea
              placeholder="Biography"
              {...methods.register('biography')}
            />
            
            <FileUploadGraphQL
              name="avatar"
              label="Author Avatar"
              accept="image/*"
              onUploadComplete={(responses) => {
                console.log('Avatar ready for author creation:', responses[0]);
              }}
            />
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating Author...' : 'Create Author'}
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </Card>
  );
};

// Example 5: Manual File Upload with GraphQL
export const ManualUploadExample = () => {
  const { uploadSingleFile, isUploading } = useFileUpload({
    onProgress: (progress) => {
      console.log(`Upload progress: ${progress.overallProgress}%`);
    },
    onSuccess: (responses) => {
      console.log('Files uploaded successfully:', responses);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadResponse = await uploadSingleFile(file);
      
      // Now use the upload response in a GraphQL mutation
      console.log('File uploaded, URL:', uploadResponse.url);
      
      // Example: Update user profile with the new file
      // await updateUserProfile({
      //   variables: {
      //     profileImageUrl: uploadResponse.url
      //   }
      // });
      
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Card>
      <Heading size="4" mb="4">Manual Upload Example</Heading>
      <Flex direction="column" gap="4">
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        {isUploading && <p>Uploading file...</p>}
      </Flex>
    </Card>
  );
};

