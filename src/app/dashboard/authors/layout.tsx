import { Flex } from '@radix-ui/themes';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" gap="4">
      {children}
    </Flex>
  );
}
