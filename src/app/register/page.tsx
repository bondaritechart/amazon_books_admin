import classes from './registrer.module.scss';
import {
  Box,
  Card,
  Container,
  Flex,
  Heading,
  TextField,
} from '@radix-ui/themes';

export default function RegisterPage() {
  return (
    <div className={classes.wrapper}>
      <Container px="4" size="1" height="100dvh">
        <Flex direction="column" height="100%" justify="center">
          <Card variant="classic">
            <Heading size="6" weight="medium">
              Register
            </Heading>
            <Box>
              <TextField.Root name="email" placeholder="Email" />
              <TextField.Root name="password" placeholder="Password" />
            </Box>
          </Card>
        </Flex>
      </Container>
    </div>
  );
}
