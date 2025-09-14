'use client';

import { FileUpload } from '@/components/form';
import { TextArea } from '@/components/form/text-area/text-area';
import { TextInput } from '@/components/form/text-input/text-input';
import { useCreateAuthor } from '@/data-access/author/hooks/use-create-author';
import { Button, Flex, Heading } from '@radix-ui/themes';
import { useForm, FormProvider } from 'react-hook-form';

export default function Page() {
  const methods = useForm();
  const [createAuthor] = useCreateAuthor();

  const handleSave = (data: Record<string, unknown>) => {
    console.log('debug data', data);
    
    // Prepare the input data
    const input: Record<string, unknown> = {
      firstName: data.firstName,
      lastName: data.lastName,
      biography: data.biography,
    };
    
    // Only include avatar if a file is selected
    if (data.avatar && data.avatar instanceof File) {
      input.avatar = data.avatar;
    }
    
    console.log('debug input', input);
    
    createAuthor({
      variables: {
        input,
      },
    }).then((r) => {
      console.log('debug r', r);
    }).catch((error) => {
      console.error('Error creating author:', error);
    });
  };

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Add new author</Heading>
      <FormProvider {...methods}>
        <form action="">
          <Flex direction="column" gap="4" maxWidth="500px" width="100vw">
            <TextInput name="firstName" label="First name" />
            <TextInput name="lastName" label="Last name" />
            <TextArea name="biography" label="Biography" />
            <FileUpload label="Avatar" name="avatar" accept="image/*" />
            <Button onClick={methods.handleSubmit(handleSave)}>Add</Button>
          </Flex>
        </form>
      </FormProvider>
    </Flex>
  );
}
