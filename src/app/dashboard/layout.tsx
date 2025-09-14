import { Button, Flex, Grid } from '@radix-ui/themes';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Grid columns="250px 1fr" height="100dvh">
      <Flex
        p="4"
        direction="column"
        gap="2"
        style={{
          background: 'var(--accent-12)',
          color: 'var(--accent-contrast)',
        }}
      >
        <Link href="/dashboard/books">
          <Button size="2" color="mint">
            Books
          </Button>
        </Link>
        <Link href="/dashboard/authors">
          <Button size="2" color="mint">
            Authors
          </Button>
        </Link>
      </Flex>
      <Flex p="4">{children}</Flex>
    </Grid>
  );
}
