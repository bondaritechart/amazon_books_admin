import { Flex, Heading } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';

export default function Page() {
  const methods = useForm();

  return (
    <Flex direction="column" gap="4">
      <Heading size="6">Add new book</Heading>

      <form action="">
        <Flex direction="column" gap="4"></Flex>
      </form>
    </Flex>
  );
}
