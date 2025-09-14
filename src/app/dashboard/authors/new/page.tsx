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

  const handleSave = (data: any) => {
    console.log('debug data', data);
    createAuthor({
      variables: {
        input: data,
      },
    }).then((r) => {
      console.log('debug r', r);
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
            <FileUpload label="Avatar" name="avatar" />
            <Button onClick={methods.handleSubmit(handleSave)}>Add</Button>
          </Flex>
        </form>
      </FormProvider>
    </Flex>
  );
}
