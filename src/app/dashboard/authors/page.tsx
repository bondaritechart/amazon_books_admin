'use client';

import { useGetAuthors } from '@/data-access/author/hooks/use-get-authors';
import { Box, Card, Flex } from '@radix-ui/themes';

export default function AuthorsPage() {
  const { data } = useGetAuthors();
  console.log('debug data', data);
  return (
    <>
      {data?.authors.map((author) => (
        <Card id={author.id} key={author.id}>
          <Flex gap="4">
            <Box>{author.firstName}</Box> <Box>{author.lastName}</Box>{' '}
            {author.avatar && (
              <img src={'http://localhost:2401' + author.avatar} alt="" />
            )}
          </Flex>
        </Card>
      ))}
    </>
  );
}
